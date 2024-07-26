'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { selectItemColumns } from '../columns/select-item-columns'
import { cn } from '@/utils/utils'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { CheckIcon, Loader2, Plus, TrashIcon, X } from 'lucide-react'
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
import { format, startOfDay } from 'date-fns'
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
import {
  Prisma,
  Despacho,
  Despachos_Renglones,
  Profesional_Abastecimiento,
} from '@prisma/client'
import ModalForm from '@/modules/common/components/modal-form'
import {
  createDispatch,
  updateDispatch,
} from '@/app/(main)/dashboard/armamento/despachos/lib/actions/dispatches'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { Input } from '@/modules/common/components/input/input'
import Link from 'next/link'
import { CardItemDispatch } from './card-item-dispatch'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
type DestinatarioWithRelations = Prisma.DestinatarioGetPayload<{
  include: {
    grado: true
    categoria: true
    componente: true
    unidad: true
  }
}>

type Detalles = Omit<
  Despachos_Renglones,
  'id_despacho' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}

type ComboboxData = {
  value: string
  label: string
}
type FormValues = Omit<
  Despacho,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  destinatario: DestinatarioWithRelations
  supervisor?: Profesional_Abastecimiento
  abastecedor?: Profesional_Abastecimiento
  autorizador?: Profesional_Abastecimiento
  renglones: Detalles[]
}
interface Props {
  renglonesData: RenglonWithAllRelations[]
  defaultValues?: Despacho & {
    destinatario: DestinatarioWithRelations
    supervisor?: Profesional_Abastecimiento
    abastecedor?: Profesional_Abastecimiento
    autorizador?: Profesional_Abastecimiento
    renglones: Detalles[]
  }
  professionals: ComboboxData[]
  receivers: ComboboxData[]
}
export default function DispatchesForm({
  renglonesData,
  defaultValues,
  professionals,
  receivers,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)

  const form = useForm<FormValues>({
    mode: 'all',
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
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const toogleAlert = () => {
    const fecha = form.watch(`fecha_despacho`)

    if (fecha < startOfDay(new Date())) {
      form.resetField('fecha_despacho')
    }
  }
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
            cantidad: 0,
            manualSelection: false,
            seriales: [],
            observacion: '',
            fecha_eliminacion: null,
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
      item.seriales.length === 0 && item.manualSelection
        ? setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
        : null
    })

    if (itemsWithoutSerials.length > 0) {
      return
    }

    if (!isEditEnabled) {
      startTransition(() => {
        createDispatch(data).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })
            return
          }
          toast({
            title: 'Despacho creado',
            description: 'Los despachos se han creado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/armamento/despachos')
        })
      })

      return
    }

    startTransition(() => {
      updateDispatch(defaultValues.id, data).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Despacho actualizado',
          description: 'Los despachos se han actualizado correctamente',
          variant: 'success',
        })
        router.replace('/dashboard/armamento/despachos')
      })
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
              Complete la información solicitada para el despacho de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para el despacho de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <div className="flex flex-1 gap-4">
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
                      Profesional que supervisará el despacho (opcional):
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
            <div className="border-b border-base-300" />

            <FormField
              control={form.control}
              name="motivo"
              rules={{
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
                      Redacta el motivo por el cual se está despachando el
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
              name={`fecha_despacho`}
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
                    <FormLabel>Fecha de despacho</FormLabel>
                    <FormDescription>
                      Selecciona la fecha en la que se despachan los materiales
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
                        maxDate={new Date()}
                      />
                      <Button
                        variant={'secondary'}
                        onClick={(e) => {
                          e.preventDefault()
                          form.resetField('fecha_despacho')
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
            {form.watch('fecha_despacho') < startOfDay(new Date()) &&
            isAuthorized === false ? (
              <ModalForm
                triggerName=" Parece que estás colocando una fecha anterior a la actual"
                closeWarning={false}
                open={form.watch('fecha_despacho') < new Date()}
                customToogleModal={toogleAlert}
                className="w-[550px]"
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>
                    Estas colocando una fecha anterior a la fecha actual
                  </CardTitle>
                  <CardDescription>
                    Para evitar inconsistencias de información, debes colocar el
                    motivo de la fecha y colocar la contraseña de administrador.
                  </CardDescription>
                  <Input
                    className="w-full"
                    placeholder="Contraseña del administrador"
                    type="password"
                    onChange={(e) => {
                      const value = e.target.value

                      setAdminPassword(value)
                    }}
                  />
                  <Button
                    className="w-[200px]"
                    variant={'default'}
                    onClick={(e) => {
                      e.preventDefault()
                      validateAdminPassword(adminPassword).then((res) => {
                        if (!adminPassword) return
                        if (res === true) {
                          setIsAuthorized(true)
                          toast({
                            title: 'Fecha autorizada',
                            description: 'La fecha ha sido autorizada',
                            variant: 'success',
                          })

                          return
                        }

                        setAdminPassword('')
                        toast({
                          title: 'Permiso denegado',
                          description: 'La contraseña es incorrecta',
                          variant: 'destructive',
                        })
                      })
                    }}
                  >
                    Listo
                  </Button>
                </div>
              </ModalForm>
            ) : null}
            {form.watch('fecha_despacho') < startOfDay(new Date()) &&
            isAuthorized === true ? (
              <FormField
                control={form.control}
                name="motivo_fecha"
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
                      <FormLabel>
                        Introduzca el motivo de por qué la fecha es anterior a
                        la actual
                      </FormLabel>
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
            ) : null}
            <div className="border-b border-base-300" />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han despachado
              </FormDescription>
              <ModalForm
                triggerName="Seleccionar renglones"
                closeWarning={false}
                open={isModalOpen}
                customToogleModal={toogleModal}
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>Selecciona los renglones despachados</CardTitle>
                  <CardDescription>
                    Encuentra y elige los productos que se han despachado en el
                    CESERLODAI. Usa la búsqueda para agilizar el proceso.
                  </CardDescription>
                  <CardDescription>
                    Si no encuentras el renglón que buscas, puedes crearlo
                    <Link
                      href="/dashboard/armamento/inventario/renglon"
                      className={cn(
                        buttonVariants({ variant: 'secondary' }),
                        'mx-4'
                      )}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Renglón
                    </Link>
                  </CardDescription>
                  <DataTable
                    columns={selectItemColumns}
                    data={renglonesData}
                    onSelectedRowsChange={handleTableSelect}
                    selectedData={selectedRowIdentifiers}
                    setSelectedData={setSelectedRowIdentifiers}
                    isStatusEnabled={false}
                  />
                  <Button
                    className="w-[200px] sticky bottom-8 left-8"
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
                  // console.log('item', item, item.devoluciones, item.despachos)
                  const enabledReceptions = item.recepciones.filter(
                    (reception) =>
                      reception.recepcion.fecha_eliminacion === null
                  )
                  const receptions = enabledReceptions.reduce(
                    (total, item) => total + item.cantidad,
                    0
                  )

                  const enabledDispatches = item.despachos.filter(
                    (dispatch) => dispatch.despacho.fecha_eliminacion === null
                  )

                  const dispatchedSerials = enabledDispatches.reduce(
                    (total, item) => total + item.seriales.length,
                    0
                  )

                  const enabledReturns = item.devoluciones.filter(
                    (returnItem) =>
                      returnItem.devolucion.fecha_eliminacion === null
                  )
                  const returnedSerials = enabledReturns.reduce(
                    (total, item) => total + item.seriales.length,
                    0
                  )
                  const currentDispatch = item.despachos.find((item) => {
                    // @ts-ignore
                    return item.id_despacho === defaultValues?.id
                  })
                  const totalStock = isEditEnabled
                    ? receptions -
                      dispatchedSerials +
                      (currentDispatch?.seriales.length ?? 0) +
                      returnedSerials
                    : receptions - dispatchedSerials + returnedSerials
                  const isEmpty = totalStock <= 0
                  const isError = itemsWithoutSerials.includes(item.id)
                  return (
                    <CardItemDispatch
                      key={item.id}
                      item={item}
                      index={index}
                      // @ts-ignore
                      totalStock={totalStock < 0 ? 0 : totalStock}
                      dispatchId={defaultValues?.id}
                      deleteItem={deleteItem}
                      isEmpty={isEmpty ? 'Este renglon no tiene stock' : false}
                      isError={
                        isError ? 'Este renglon no tiene seriales' : false
                      }
                      setItemsWithoutSerials={setItemsWithoutSerials}
                      isEditEnabled={isEditEnabled}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
          <Button
            className="w-[200px]"
            disabled={isPending}
            variant="default"
            type={'submit'}
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
