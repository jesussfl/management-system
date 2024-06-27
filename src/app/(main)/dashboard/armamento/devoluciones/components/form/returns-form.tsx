'use client'
import { useCallback, useEffect, useState } from 'react'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { CheckIcon, Plus, TrashIcon, X } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { RenglonWithAllRelations } from '@/types/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Prisma, Devoluciones_Renglones, Devolucion } from '@prisma/client'
import ModalForm from '@/modules/common/components/modal-form'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import Link from 'next/link'
import { SelectedItemCard } from './card-item-selected'
import { createReturn, updateReturn } from '../../lib/actions/returns'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
type DestinatarioWithRelations = Prisma.DestinatarioGetPayload<{
  include: {
    grado: true
    categoria: true
    componente: true
    unidad: true
  }
}>

type Detalles = Omit<
  Devoluciones_Renglones,
  'id_devolucion' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}

type FormValues = Omit<
  Devolucion,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  destinatario: DestinatarioWithRelations

  renglones: Detalles[]
}
type ComboboxData = {
  value: string
  label: string
}
interface Props {
  renglonesData: RenglonWithAllRelations[]
  defaultValues?: FormValues
  receivers: ComboboxData[]
  professionals: ComboboxData[]
  close?: () => void
}

export default function ReturnsForm({
  renglonesData,
  defaultValues,
  receivers,
  professionals,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `renglones`,
  })

  const [selectedRowIdentifiers, setSelectedRowIdentifiers] = useState<{
    [key: number]: boolean
  }>({})
  const [selectedItems, setSelectedItems] = useState<RenglonWithAllRelations[]>(
    []
  )
  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])

  useEffect(() => {
    if (defaultValues) {
      const renglones = defaultValues.renglones
      // @ts-ignore
      const renglonesData = renglones.map((item) => item.renglon) //TODO: revisar el tipado
      const selections = renglones.reduce(
        (acc, item) => {
          acc[item.id_renglon] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )
      setSelectedRowIdentifiers(selections)
      setSelectedItems(renglonesData)
    }
  }, [defaultValues])

  const handleTableSelect = useCallback(
    (selections: any[]) => {
      if (!selections) return

      // Obtener los IDs de los elementos seleccionados
      const selectionIds = selections.map((item) => item.id)

      // Iterar sobre los elementos actuales y eliminar los que no están en selections
      fields.forEach((field, index) => {
        if (selectionIds.length === 0) return

        if (!selectionIds.includes(field.id_renglon)) {
          remove(index)
        }
      })

      // Agregar los nuevos elementos de selections que no están en fields
      selections.forEach((item) => {
        const exists = fields.some((field) => field.id_renglon === item.id)
        if (!exists) {
          append({
            id_renglon: item.id,

            seriales: [],
          })
        }
      })

      setSelectedItems(selections)
    },
    [append, remove, fields]
  )

  const deleteItem = (index: number) => {
    setSelectedItems((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedRowIdentifiers }
        if (item.id === selectedItems[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedRowIdentifiers(nuevoObjeto)
        }
        return item.id !== selectedItems[index].id
      })
    })
    remove(index)
  }
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear una recepción sin renglones',
      })
      return
    }

    data.renglones.map((item) => {
      item.seriales.length === 0
        ? setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
        : null
    })

    if (itemsWithoutSerials.length > 0) {
      return
    }
    if (!isEditEnabled) {
      createReturn(data).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Devolución creada',
          description: 'Las devoluciones se han creado correctamente',
          variant: 'success',
        })
        router.replace('/dashboard/armamento/devoluciones')
      })

      return
    }

    // @ts-ignore
    updateReturn(defaultValues?.id, data).then((res) => {
      if (res?.error) {
        toast({
          title: 'Error',
          description: res?.error,
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Devolución actualizada',
        description: 'Las devoluciones se han actualizado correctamente',
        variant: 'success',
      })
      router.replace('/dashboard/armamento/devoluciones')
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-10 mb-[8rem] "
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Complete la información solicitada para la devolución de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para la devolución de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="cedula_destinatario"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormLabel>Destinatario:</FormLabel>
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
                              : 'Seleccionar destinatario'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar destinatario..."
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
                                  form.setValue(
                                    'cedula_destinatario',
                                    receiver.value
                                  )
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
              <FormField
                control={form.control}
                name="cedula_abastecedor"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className=" flex-1 ">
                    <FormLabel>
                      Profesional que entregará el despacho:
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
                                  form.setValue(
                                    'cedula_abastecedor',
                                    professional.value
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
            <div className="flex flex-1 gap-4">
              <FormField
                control={form.control}
                name="cedula_autorizador"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Profesional que autorizará el despacho:
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
                                  form.setValue(
                                    'cedula_autorizador',
                                    professional.value
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
                control={form.control}
                name="cedula_supervisor"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Profesional que supervisa la devolución (opcional):
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
                                form.setValue('cedula_supervisor', '')
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
                                  form.setValue(
                                    'cedula_supervisor',
                                    professional.value
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
            </div>

            <FormField
              control={form.control}
              name="motivo"
              rules={{
                required: 'Este campo es necesario',
                minLength: {
                  value: 10,
                  message: 'Debe tener al menos 10 carácteres',
                },
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
                      Redacta el motivo por el cual se está devolviendo el
                      material, renglones, etc...
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
              control={form.control}
              name={`fecha_devolucion`}
              rules={{
                required: true,
                validate: (value) => {
                  if (value > new Date())
                    return 'La fecha no puede ser mayor a la actual'
                },
              }}
              render={({ field }) => (
                <FormItem className="flex flex-row flex-1 justify-between items-center gap-5 ">
                  <div className="w-[20rem]">
                    <FormLabel>Fecha de devolución</FormLabel>
                    <FormDescription>
                      Selecciona la fecha en la que se devuelven los materiales
                      o renglones{' '}
                    </FormDescription>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <DatePicker
                        placeholderText="Seleccionar fecha"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        locale={es}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        showTimeSelect
                        dateFormat="d MMMM, yyyy h:mm aa"
                        dropdownMode="select"
                      />
                      <Button
                        variant={'secondary'}
                        onClick={(e) => {
                          e.preventDefault()
                          field.onChange(null)
                        }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="border-b border-base-300" />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han devuelto
              </FormDescription>
              <ModalForm
                triggerName="Seleccionar renglones"
                closeWarning={false}
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>
                    Selecciona los renglones que se han devuelto
                  </CardTitle>
                  <CardDescription>
                    Encuentra y elige los productos que se han devuelto en el
                    CESERLODAI. Usa la búsqueda para agilizar el proceso.
                  </CardDescription>

                  <DataTable
                    columns={columns}
                    data={renglonesData.filter((item) => {
                      if (item.despachos.length > 0) {
                        return true
                      }

                      return false
                    })}
                    onSelectedRowsChange={handleTableSelect}
                    isColumnFilterEnabled={false}
                    selectedData={selectedRowIdentifiers}
                    setSelectedData={setSelectedRowIdentifiers}
                  />
                </div>
              </ModalForm>
            </div>
          </CardContent>
        </Card>

        {selectedItems.length > 0 && (
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
              <div className="grid md:grid-cols-2 gap-4">
                {selectedItems.map((item, index) => {
                  const isError = itemsWithoutSerials.includes(item.id)
                  return (
                    <SelectedItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      deleteItem={deleteItem}
                      isError={
                        isError ? 'Este renglon no tiene seriales' : false
                      }
                      isEditEnabled={isEditEnabled}
                      // @ts-ignore
                      returnId={defaultValues?.id}
                      setItemsWithoutSerials={setItemsWithoutSerials}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
        <Button variant="default" type={'submit'}>
          Guardar Devolución
        </Button>
      </form>
    </Form>
  )
}
