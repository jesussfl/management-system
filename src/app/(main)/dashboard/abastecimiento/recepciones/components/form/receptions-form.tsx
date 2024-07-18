'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useFormState,
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

import { format } from 'date-fns'
import { CheckIcon, Loader2, Plus, TrashIcon, X } from 'lucide-react'
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
  Recepcion,
  Recepciones_Renglones,
  Serial,
} from '@prisma/client'
import {
  RecepcionType,
  createReception,
  updateReception,
} from '@/app/(main)/dashboard/abastecimiento/recepciones/lib/actions/receptions'
import ModalForm from '@/modules/common/components/modal-form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { CardItemSelected } from './card-item-selected'
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
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { Combobox } from '@/modules/common/components/combobox'
type SerialType = Omit<
  Serial,
  'id' | 'id_recepcion' | 'fecha_creacion' | 'ultima_actualizacion'
>

type RenglonType = Prisma.RenglonGetPayload<{
  include: { unidad_empaque: true; recepciones: true }
}>
type Detalles = Omit<
  Recepciones_Renglones,
  'id_recepcion' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: SerialType[]
}

export type FormValues = Omit<
  Recepcion,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  renglones: Detalles[]
}
type ComboboxData = {
  value: string
  label: string
}
interface Props {
  renglonesData: RenglonType[]
  defaultValues?: RecepcionType
  professionals: ComboboxData[]
  receivers: ComboboxData[]
}
export default function ReceptionsForm({
  renglonesData,
  defaultValues,
  professionals,
  receivers,
}: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const form = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  })
  const { isDirty } = useFormState({ control: form.control })

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `renglones`,
  })
  const [isPending, startTransition] = useTransition()

  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<any>({})
  const [selectedRowsData, setSelectedRowsData] = useState<RenglonType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toogleModal = () => setIsModalOpen(!isModalOpen)

  useEffect(() => {
    if (defaultValues) {
      const items = defaultValues.renglones
      const itemsData = items.map((item) => item.renglon)
      const selectedItems = items.reduce(
        (acc, item) => {
          acc[item.id_renglon] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )

      setSelectedRows(selectedItems)
      setSelectedRowsData(itemsData)
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
            fabricante: null,
            precio: 0,
            codigo_solicitud: null,
            fecha_fabricacion: null,
            fecha_vencimiento: null,
            seriales: [],
            seriales_automaticos: false,
            observacion: null,
            fecha_eliminacion: null,
          })
        }
      })

      setSelectedRowsData(selections)
    },
    [append, remove, fields]
  )

  const deleteItem = (index: number) => {
    setSelectedRowsData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedRows }
        if (item.id === selectedRowsData[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedRows(nuevoObjeto)
        }
        return item.id !== selectedRowsData[index].id
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
      item.seriales.length === 0 &&
        setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
    })

    if (itemsWithoutSerials.length > 0) {
      return
    }

    startTransition(() => {
      if (!isEditEnabled) {
        createReception(data).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })

            //@ts-ignore
            res.fields?.map((field) => {
              setItemsWithoutSerials((prev) => [...prev, field])
            })
            return
          }

          toast({
            title: 'Recepción creada',
            description: 'La recepción se ha creado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/abastecimiento/recepciones')
        })
        return
      }

      if (!isDirty) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }

      updateReception(defaultValues?.id, data).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Recepción actualizada',
          description: 'La recepción se ha actualizado correctamente',
          variant: 'success',
        })
        router.replace('/dashboard/abastecimiento/recepciones')
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
              Complete la información solicitada para la recepción de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para la recepción de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="cedula_destinatario"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1 ">
                    <FormLabel>Persona que entrega:</FormLabel>
                    <Combobox
                      name={field.name}
                      form={form}
                      field={field}
                      data={receivers}
                      isValueString
                    />

                    <FormDescription>
                      <Link
                        href="/dashboard/abastecimiento/destinatarios/agregar"
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
                  <FormItem className=" flex flex-col flex-1">
                    <FormLabel>Profesional que recibe:</FormLabel>
                    <Combobox
                      name={field.name}
                      form={form}
                      field={field}
                      data={professionals}
                      isValueString
                    />

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
                control={form.control}
                name="cedula_autorizador"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>
                      Profesional que autorizará la recepción:
                    </FormLabel>
                    <Combobox
                      name={field.name}
                      form={form}
                      field={field}
                      data={professionals}
                      isValueString
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cedula_supervisor"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>
                      Profesional que supervisa la recepción (opcional):
                    </FormLabel>

                    <Combobox
                      name={field.name}
                      form={form}
                      field={field}
                      data={professionals}
                      isValueString
                    />

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
                      Redacta el motivo por el cual se está recibiendo el
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
              name={`fecha_recepcion`}
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
                    <FormLabel>Fecha de recepción</FormLabel>
                    <FormDescription>
                      Selecciona la fecha en la que se reciben los materiales o
                      renglones{' '}
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
                        minDate={new Date()}
                        maxDate={new Date(2025, 12, 31)}
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
                Selecciona los materiales o renglones que se han recibido
              </FormDescription>
              <ModalForm
                triggerName="Seleccionar renglones"
                closeWarning={false}
                open={isModalOpen}
                customToogleModal={toogleModal}
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>Selecciona los renglones recibidos</CardTitle>
                  <CardDescription>
                    Encuentra y elige los productos que se han recibido en el
                    CESERLODAI. Usa la búsqueda para agilizar el proceso.
                  </CardDescription>
                  <CardDescription>
                    Si no encuentras el renglón que buscas, puedes crearlo
                    <Link
                      href="/dashboard/abastecimiento/inventario/renglon"
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
                    columns={columns}
                    data={renglonesData}
                    onSelectedRowsChange={handleTableSelect}
                    isColumnFilterEnabled={false}
                    selectedData={selectedRows}
                    isStatusEnabled={false}
                    setSelectedData={setSelectedRows}
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
            <CardContent className="flex flex-col gap-8 pt-4">
              <div className="grid xl:grid-cols-2 gap-4">
                {selectedRowsData.map((item, index) => {
                  const isEmpty = itemsWithoutSerials.includes(item.id)
                  return (
                    <CardItemSelected
                      key={item.id}
                      item={item}
                      index={index}
                      deleteItem={deleteItem}
                      isEmpty={
                        isEmpty
                          ? 'Este renglon no tiene seriales asociados'
                          : false
                      }
                      setItemsWithoutSerials={setItemsWithoutSerials}
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
