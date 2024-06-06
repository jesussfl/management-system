'use client'
import { useEffect, useState, useTransition } from 'react'

import { orderItemColumns } from '../columns/order-item-columns'
import { cn } from '@/utils/utils'
import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { format } from 'date-fns'
import { CheckIcon, Loader2, Plus, X } from 'lucide-react'
import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  Estados_Pedidos,
  Pedidos_Renglones,
  Prisma,
  Tipos_Proveedores,
} from '@prisma/client'
import ModalForm from '@/modules/common/components/modal-form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { CardItemOrder } from './card-item-order'
import Link from 'next/link'
import { Input } from '@/modules/common/components/input/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { createOrder, updateOrder } from '../../lib/actions/orders'
import { ComboboxData } from '@/types/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { useHandleTableSelect } from '../../lib/hooks/use-handle-table-select'

type RenglonType = Prisma.RenglonGetPayload<{
  include: {
    unidad_empaque: true
    recepciones: {
      include: { seriales: true }
    }
  }
}>
export type PedidoForm = {
  fecha_solicitud: Date

  estado?: Estados_Pedidos | null

  tipo_proveedor: Tipos_Proveedores

  motivo: string

  id_unidad?: number
  id_proveedor?: number

  id_destinatario?: number
  id_supervisor?: number
  id_abastecedor: number
  id_autorizador: number
  renglones: {
    id_renglon: number
    cantidad: number
    observacion?: string | null
  }[]
}
export type PedidoFormValues = PedidoForm
interface Props {
  items: RenglonType[]
  professionals: ComboboxData[]
  receivers: ComboboxData[]
  suppliers: ComboboxData[]
  units: {
    value: number
    label: string
  }[]
  defaultValues?: PedidoFormValues
  orderId?: number
}

export default function OrdersForm({
  items,
  professionals,
  receivers,
  suppliers,
  units,
  defaultValues,
  orderId,
}: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const { unregister, setValue, control, ...rest } = useForm<PedidoFormValues>({
    mode: 'onChange',
    defaultValues,
  })

  const {
    unselectItem,
    selectedItemsData,
    selectedItems,
    handleTableSelect,
    setSelectedItems,
  } = useHandleTableSelect(
    control,
    isEditEnabled,
    defaultValues?.renglones,
    items
  )

  const { isDirty } = useFormState({ control })

  const [isPending, startTransition] = useTransition()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)
  const supplierType = rest.watch('tipo_proveedor')
  useEffect(() => {
    if (supplierType === 'Empresa') {
      unregister('id_unidad', {
        keepDefaultValue: true,
        keepDirty: true,
      })
      unregister('id_destinatario', {
        keepDefaultValue: true,
        keepDirty: true,
      })
    }

    if (supplierType === 'Persona') {
      unregister('id_proveedor', {
        keepDefaultValue: true,
        keepDirty: true,
      })
      unregister('id_unidad', {
        keepDefaultValue: true,
        keepDirty: true,
      })
    }

    if (supplierType === 'Unidad') {
      unregister('id_destinatario', {
        keepDefaultValue: true,
        keepDirty: true,
      })
      unregister('id_proveedor', {
        keepDirty: true,
      })
    }
  }, [supplierType, unregister, setValue])
  const onSubmit: SubmitHandler<PedidoFormValues> = async (data) => {
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear un pedido sin renglones',
      })
      return
    }

    startTransition(() => {
      if (!isEditEnabled) {
        createOrder(data).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })

            return
          }

          toast({
            title: 'Pedido creado',
            description: 'El pedido se ha creado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/armamento/pedidos')
        })
        return
      }

      if (!isDirty) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }

      if (orderId)
        updateOrder(orderId, data).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })
            return
          }
          toast({
            title: 'Pedido actualizado',
            description: 'El pedido se ha actualizado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/armamento/pedidos')
        })
    })
  }
  return (
    <Form
      {...{
        control,
        unregister,
        setValue,
        ...rest,
      }}
    >
      <form
        onSubmit={rest.handleSubmit(onSubmit)}
        className=" space-y-10 mb-[8rem] "
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Complete la información solicitada para el pedido de suministros
            </CardTitle>
            <CardDescription>Llene los campos solicitados.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <FormField
              control={control}
              name="tipo_proveedor"
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Proveedor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Persona">Persona</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                      <SelectItem value="Unidad">Unidad</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {supplierType === 'Persona' && (
              <FormField
                control={control}
                name="id_destinatario"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormLabel>Proveedor/Persona:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? receivers.find(
                                  (receiver) => receiver.value === field.value
                                )?.label
                              : 'Seleccionar proveedor'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar proveedor..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {receivers.map((receiver) => (
                              <CommandItem
                                value={receiver.label}
                                key={receiver.value}
                                onSelect={() => {
                                  setValue('id_destinatario', receiver.value, {
                                    shouldDirty: true,
                                  })
                                }}
                              >
                                {receiver.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    receiver.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormDescription>
                      <Link
                        href="/dashboard/armamento/destinatarios/agregar"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'text-sm h-[30px]'
                        )}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Destinatario
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {supplierType === 'Unidad' && (
              <FormField
                control={control}
                name="id_unidad"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormLabel>Unidad:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? units.find(
                                  (receiver) => receiver.value === field.value
                                )?.label
                              : 'Seleccionar unidad'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar unidad..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {units.map((unit) => (
                              <CommandItem
                                value={unit.label}
                                key={unit.value}
                                onSelect={() => {
                                  setValue('id_unidad', unit.value, {
                                    shouldDirty: true,
                                  })
                                }}
                              >
                                {unit.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    unit.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormDescription>
                      <Link
                        href="/dashboard/armamento/destinatarios/agregar"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'text-sm h-[30px]'
                        )}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Destinatario
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {supplierType === 'Empresa' && (
              <FormField
                control={control}
                name="id_proveedor"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormLabel>Proveedor/Empresa:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? suppliers.find(
                                  (supplier) => supplier.value === field.value
                                )?.label
                              : 'Seleccionar'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {suppliers.map((supplier) => (
                              <CommandItem
                                value={supplier.label}
                                key={supplier.value}
                                onSelect={() => {
                                  setValue('id_proveedor', supplier.value, {
                                    shouldDirty: true,
                                  })
                                }}
                              >
                                {supplier.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    supplier.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormDescription>
                      <Link
                        href="/dashboard/armamento/pedidos/proveedor/nuevo"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'text-sm h-[30px]'
                        )}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Proveedor
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex gap-4">
              <FormField
                control={control}
                name="id_abastecedor"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>Profesional que abastecerá:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? professionals.find(
                                  (professional) =>
                                    professional.value === field.value
                                )?.label
                              : 'Seleccionar profesional'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar profesional..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {professionals.map((professional) => (
                              <CommandItem
                                value={professional.label}
                                key={professional.value}
                                onSelect={() => {
                                  setValue(
                                    'id_abastecedor',
                                    professional.value,
                                    { shouldDirty: true }
                                  )
                                }}
                              >
                                {professional.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    professional.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormDescription>
                      <Link
                        href="/dashboard/profesionales/agregar"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'text-sm h-[30px]'
                        )}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Profesional
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <FormField
                control={control}
                name="id_autorizador"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Profesional que autorizará:</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? professionals.find(
                                  (professional) =>
                                    professional.value === field.value
                                )?.label
                              : 'Seleccionar profesional'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar profesional..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {professionals.map((professional) => (
                              <CommandItem
                                value={professional.label}
                                key={professional.value}
                                onSelect={() => {
                                  setValue(
                                    'id_autorizador',
                                    professional.value,
                                    { shouldDirty: true }
                                  )
                                }}
                              >
                                {professional.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    professional.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="id_supervisor"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Profesional que supervisa la recepción (opcional):
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? professionals.find(
                                  (professional) =>
                                    professional.value === field.value
                                )?.label
                              : 'Seleccionar profesional'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <div className="flex items-center gap-2">
                            <CommandInput
                              placeholder="Buscar profesional..."
                              className="flex-1 h-9"
                            />
                            <Button
                              className="px-2"
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                setValue('id_supervisor', undefined)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {professionals.map((professional) => (
                              <CommandItem
                                value={professional.label}
                                key={professional.value}
                                onSelect={() => {
                                  setValue('id_supervisor', professional.value)
                                }}
                              >
                                {professional.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    professional.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-b border-base-300" />
            <FormField
              control={control}
              name="motivo"
              rules={{
                required: 'Este campo es obligatorio',
                maxLength: {
                  value: 200,
                  message: 'Debe tener un máximo de 200 carácteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <div className="flex flex-col gap-1">
                    <FormLabel>Motivo</FormLabel>
                    <FormDescription>
                      Redacta el motivo por el cual se realiza este pedido. 200
                      carácteres max.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <textarea
                      id="motivo"
                      rows={3}
                      className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-b border-base-300" />
            <FormField
              control={control}
              name={`fecha_solicitud`}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row flex-1 items-center gap-5 ">
                    <div className="w-[20rem]">
                      <FormLabel>Fecha de Solicitud</FormLabel>
                      <FormDescription>
                        Selecciona la fecha en la que se realiza esta solicitud
                      </FormDescription>
                    </div>
                    <div className="flex-1 w-full">
                      <Input
                        type="datetime-local"
                        id="fecha_recepcion"
                        {...field}
                        value={
                          field.value
                            ? format(
                                new Date(field.value),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ''
                        }
                        onBlur={() => {
                          rest.trigger('fecha_solicitud')
                        }}
                        onChange={(e) => {
                          if (!e.target.value) {
                            // @ts-ignore
                            setValue('fecha_solicitud', null)
                            return
                          }

                          setValue('fecha_solicitud', new Date(e.target.value))
                        }}
                        className="w-full"
                      />

                      <FormMessage />
                    </div>
                  </FormItem>
                )
              }}
            />
            <div className="border-b border-base-300" />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona el material que deseas solicitar
              </FormDescription>
              <ModalForm
                triggerName="Seleccionar renglones"
                closeWarning={false}
                open={isModalOpen}
                customToogleModal={toogleModal}
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>Selecciona el material a solicitar</CardTitle>
                  <CardDescription className="text-center">
                    Encuentra y elige los renglones que deseas solicitar en el
                    CESERLODAI. Si no lo encuentras, puedes crear uno nuevo.
                    <Link
                      href="/dashboard/armamento/inventario/renglon"
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'h-[3px]'
                      )}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Renglón
                    </Link>
                  </CardDescription>
                  <div className="flex flex-row gap-4 items-center justify-center">
                    <p className="text-md font-semibold">{`Renglones seleccionados: ${selectedItemsData.length}`}</p>
                  </div>

                  <DataTable
                    columns={orderItemColumns}
                    data={items}
                    onSelectedRowsChange={handleTableSelect}
                    isColumnFilterEnabled={false}
                    selectedData={selectedItems}
                    setSelectedData={setSelectedItems}
                  />
                  <Button
                    variant={'default'}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Listo
                  </Button>
                </div>
              </ModalForm>
            </div>
          </CardContent>
        </Card>

        {selectedItemsData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Detalle la información de cada renglón seleccionado
              </CardTitle>
              <CardDescription>
                Es necesario que cada renglón contenga la información
                correspondiente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-8 pt-4">
              <div className="grid lg:grid-cols-2 gap-4">
                {selectedItemsData.map((item, index) => {
                  return (
                    <CardItemOrder
                      key={item.id}
                      item={item}
                      index={index}
                      deleteItem={unselectItem}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button disabled={isPending} variant="default" type={'submit'}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
