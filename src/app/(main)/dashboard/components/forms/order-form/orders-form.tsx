'use client'
import { useEffect, useTransition } from 'react'

import { cn } from '@/utils/utils'
import {
  useForm,
  SubmitHandler,
  useFormState,
  useFieldArray,
} from 'react-hook-form'
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
import { Estados_Pedidos, Tipos_Proveedores } from '@prisma/client'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { CardItemOrder } from './card-item-order'
import Link from 'next/link'
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
import { createOrder, updateOrder } from '@/lib/actions/order'
import { ComboboxData } from '@/types/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'

import { FormDateFields } from '@/modules/common/components/form-date-fields/form-date-fields'
import { ItemSelector } from '@/modules/common/components/item-selector'
import { useItemSelector } from '@/lib/hooks/use-item-selector'
import { ItemsWithAllRelations } from '@/lib/actions/item'
import { SelectedItemCardProvider } from '@/lib/context/selected-item-card-context'
import { itemSelectorColumns } from '../../columns/item-selector-columns'

export type PedidoForm = {
  fecha_solicitud: Date

  estado?: Estados_Pedidos | null

  tipo_proveedor: Tipos_Proveedores

  motivo: string

  id_unidad?: number
  id_proveedor?: number
  motivo_fecha?: string
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
  items: ItemsWithAllRelations
  professionals: ComboboxData[]
  receivers: ComboboxData[]
  suppliers: ComboboxData[]
  units: {
    value: number
    label: string
  }[]
  defaultValues?: PedidoFormValues
  orderId?: number
  servicio: 'Abastecimiento' | 'Armamento'
}

export default function OrdersForm({
  items,
  professionals,
  receivers,
  suppliers,
  units,
  defaultValues,
  orderId,
  servicio,
}: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const { unregister, setValue, control, ...rest } = useForm<PedidoFormValues>({
    mode: 'onChange',
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<PedidoFormValues>({
    control,
    name: `renglones`,
  })
  const { handleTableSelect, rowSelection, selectedRowsData, deleteItem } =
    useItemSelector({
      itemsData: items,
      fields: fields,
      defaultItems: defaultValues?.renglones,
      remove,
      append,
      appendObject: { cantidad: 0, observacion: null },
    })

  const { isDirty } = useFormState({ control })

  const [isPending, startTransition] = useTransition()

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
        createOrder(data, servicio).then((res) => {
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
          router.replace(`/dashboard/${servicio.toLowerCase()}/pedidos`)
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
        updateOrder(orderId, data, servicio).then((res) => {
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
          router.replace(`/dashboard/${servicio.toLowerCase()}/pedidos`)
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
        className="mb-[8rem] space-y-10"
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
                  <FormItem className="flex-1">
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
                        href="/dashboard/abastecimiento/destinatarios/agregar"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'h-[30px] text-sm'
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
                  <FormItem className="flex-1">
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
                        href="/dashboard/abastecimiento/destinatarios/agregar"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'h-[30px] text-sm'
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
                  <FormItem className="flex-1">
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
                        href="/dashboard/abastecimiento/pedidos/proveedor/nuevo"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'h-[30px] text-sm'
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
                  <FormItem className="flex-1">
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
                          'h-[30px] text-sm'
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
                              className="h-9 flex-1"
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

            <FormDateFields
              isEditEnabled={isEditEnabled}
              config={{
                dateLabel: 'Fecha de pedido',
                dateName: 'fecha_solicitud',
                dateDescription:
                  'Selecciona la fecha en la que se solicita el material',
              }}
            />

            <div className="flex flex-1 flex-row items-center justify-between gap-8">
              <FormDescription className="w-[20rem]">
                Selecciona el material que deseas solicitar
              </FormDescription>
              <ItemSelector disabled={isEditEnabled}>
                <DataTable
                  columns={itemSelectorColumns}
                  data={items}
                  onSelectedRowsChange={handleTableSelect}
                  defaultSelection={rowSelection}
                  isStatusEnabled={false}
                />
              </ItemSelector>
            </div>
          </CardContent>
        </Card>

        {fields.length > 0 && (
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
            {isEditEnabled && (
              <CardContent className="flex flex-col gap-8 pt-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  {fields.map((field, index) => {
                    const item = selectedRowsData.find(
                      (item) => item.id === field.id_renglon
                    )

                    if (!item) return null

                    return (
                      <SelectedItemCardProvider
                        key={item.id}
                        itemData={item}
                        index={index}
                        section={servicio}
                        isEditing={isEditEnabled}
                        setItemsWithoutSerials={() => {}}
                        removeCard={() => {
                          deleteItem(index, field.id_renglon)
                        }}
                        isError={''}
                      >
                        <CardItemOrder />
                      </SelectedItemCardProvider>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <DialogFooter className="fixed bottom-0 right-0 w-full items-center gap-4 border-t border-border bg-white p-4 pt-4">
          <Button
            disabled={isPending}
            variant="default"
            type={'submit'}
            className="w-[200px]"
          >
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
