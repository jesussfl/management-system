'use client'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { Input } from '@/modules/common/components/input/input'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { Box, Trash } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { RenglonType } from '@/types/types'
import { Calendar } from '@/modules/common/components/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { createRecibimiento } from '@/lib/actions/create-recibimiento'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import {
  Prisma,
  Recepcion,
  Recepciones_Renglones,
  Renglon,
} from '@prisma/client'
import { createReception } from '@/lib/actions/receptions'
import ModalForm from '@/modules/common/components/modal-form'
import { Switch } from '@/modules/common/components/switch/switch'
import { v4 } from 'uuid'

type RecepcionType = Prisma.RecepcionGetPayload<{
  include: { renglones: true }
}>
type Detalles = Omit<Recepciones_Renglones, 'id_recepcion' | 'id'>

type FormValues = Omit<Recepcion, 'id'> & {
  renglones: Detalles[]
}
interface Props {
  renglonesData: RenglonType[]
  defaultValues?: RecepcionType
  close?: () => void
}
// type FormValues = Omit<RecepcionType, 'id' | 'renglones.id_recepcion'>

export default function ReceptionsForm({
  renglonesData,
  defaultValues,
  close,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `renglones`,
  })

  const [selectedItems, setSelectedItems] = useState<any>({})
  const [selectedData, setSelectedData] = useState<RenglonType[]>([])
  const [autoSerialEnabled, setAutoSerialEnabled] = useState(
    new Array(selectedData.length).fill(false)
  )

  const toggleAutoSerial = (index: number) => {
    const updatedAutoSerialEnabled = [...autoSerialEnabled]
    updatedAutoSerialEnabled[index] = !updatedAutoSerialEnabled[index]
    setAutoSerialEnabled(updatedAutoSerialEnabled)
  }
  const handleTableSelect = useCallback(
    (lastSelectedRow: any) => {
      if (lastSelectedRow) {
        append({
          id_renglon: lastSelectedRow.id,
          cantidad: 0,
          fecha_fabricacion: null,
          fecha_vencimiento: null,
        })
        setSelectedData((prev) => {
          if (prev.find((item) => item.id === lastSelectedRow.id)) {
            const index = prev.findIndex(
              (item) => item.id === lastSelectedRow.id
            )
            remove(index)
            return prev.filter((item) => item.id !== lastSelectedRow.id)
          } else {
            return [...prev, lastSelectedRow]
          }
        })
      }
    },
    [append, remove]
  )

  const deleteItem = (index: number) => {
    setSelectedData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedItems }
        if (item.id === selectedData[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedItems(nuevoObjeto)
        }
        return item.id !== selectedData[index].id
      })
    })
    remove(index)
  }
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data, 'data')
    createReception(data).then(() => {
      toast({
        title: 'Recepción creada',
        description: 'La recepción se ha creado correctamente',
        variant: 'success',
      })
      router.replace('/dashboard/abastecimiento/recepciones')
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between "
      >
        <div className=" space-y-10 mb-[8rem]">
          <Card>
            <CardHeader>
              <CardTitle>
                Complete la información solicitada para la recepción de los
                renglones
              </CardTitle>
              <CardDescription>
                Llene los campos solicitados para la recepción de los renglones
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-8 pt-4">
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
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-row flex-1 items-center gap-5 ">
                    <div className="w-[20rem]">
                      <FormLabel>Fecha de recepción</FormLabel>
                      <FormDescription>
                        Selecciona la fecha en la que se reciben los materiales
                        o renglones{' '}
                      </FormDescription>
                    </div>
                    <div className="flex-1 w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy')
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className=" p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                >
                  <div className="flex flex-col gap-4 p-8">
                    <CardTitle>Selecciona los renglones recibidos</CardTitle>
                    <CardDescription>
                      Encuentra y elige los productos que se han recibido en el
                      CESERLODAI. Usa la búsqueda para agilizar el proceso.
                    </CardDescription>
                    <DataTable
                      columns={columns}
                      data={renglonesData}
                      onSelectedRowsChange={handleTableSelect}
                      isColumnFilterEnabled={false}
                      selectedData={selectedItems}
                      setSelectedData={setSelectedItems}
                    />
                  </div>
                </ModalForm>
              </div>
            </CardContent>
          </Card>

          {selectedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Detalle la información de cada renglón seleccionado
                </CardTitle>
                <CardDescription>
                  Es necesario que cada renglón contenga la información
                  correspondiente
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-8 pt-4">
                <div className="grid xl:grid-cols-2 gap-4">
                  {selectedData.map((item, index) => {
                    const isAutoSerialEnabled = autoSerialEnabled[index]

                    return (
                      <Card key={item.id} className="flex flex-col gap-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div className="flex flex-row gap-4 items-center">
                            <Box className="h-6 w-6 " />
                            <div>
                              <CardTitle className="text-md font-medium text-foreground">
                                {item.nombre}
                              </CardTitle>
                              <CardDescription>
                                {`${item.descripcion} - ${item.unidad_empaque.nombre} - Peso: ${item.peso} (${item.unidad_empaque.abreviacion}) `}
                              </CardDescription>
                            </div>
                          </div>

                          <Trash
                            onClick={() => deleteItem(index)}
                            className="h-5 w-5 text-red-800 cursor-pointer"
                          />
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 justify-end">
                          <div>
                            <FormField
                              control={form.control}
                              name={`renglones.${index}.cantidad`}
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <FormItem className="items-center flex justify-between gap-2">
                                  <FormLabel>Cantidad recibida:</FormLabel>
                                  <div>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        onChange={(event) =>
                                          field.onChange(
                                            parseInt(event.target.value)
                                          )
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`renglones.${index}.fecha_fabricacion`}
                              render={({ field }) => (
                                <FormItem className="items-center flex flex-1 justify-between gap-2">
                                  <FormLabel className="w-[12rem]">
                                    Fecha de fabricación:
                                  </FormLabel>
                                  <div className="flex-1 w-full">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={'outline'}
                                            className={cn(
                                              'w-full pl-3 text-left font-normal',
                                              !field.value &&
                                                'text-muted-foreground'
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, 'dd/MM/yyyy')
                                            ) : (
                                              <span>Seleccionar fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={new Date(field.value || '')}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date('1900-01-01')
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`renglones.${index}.fecha_vencimiento`}
                              render={({ field }) => (
                                <FormItem className=" items-center flex  justify-between gap-2">
                                  <FormLabel className="w-[12rem]">
                                    Fecha de vencimiento:
                                  </FormLabel>
                                  <div className="flex-1 w-full">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={'outline'}
                                            className={cn(
                                              'w-full pl-3 text-left font-normal',
                                              !field.value &&
                                                'text-muted-foreground'
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, 'dd/MM/yyyy')
                                            ) : (
                                              <span>Seleccionar fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={new Date(field.value || '')}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date('1900-01-01')
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <ModalForm
                              triggerName="Agregar seriales"
                              closeWarning={false}
                              className="max-h-[80vh]"
                              disabled={
                                !form.watch(`renglones.${index}.cantidad`)
                              }
                            >
                              <SerialsForm
                                quantity={
                                  form.watch(`renglones.${index}.cantidad`) || 0
                                }
                                isAutoSerialEnabled={isAutoSerialEnabled}
                                index={index}
                              />
                            </ModalForm>
                            {form.watch(`renglones.${index}.cantidad`) ? (
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-medium text-foreground">
                                  Seriales Automaticos:
                                </p>
                                <Switch
                                  checked={isAutoSerialEnabled}
                                  onCheckedChange={() =>
                                    toggleAutoSerial(index)
                                  }
                                />
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex items-center justify-end gap-4 w-full py-4">
          <Button variant="default" type={'submit'}>
            Guardar recepción
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function SerialsForm({
  index: indexForm,
  quantity,
  isAutoSerialEnabled,
}: {
  index: number
  quantity: number
  isAutoSerialEnabled: boolean
}) {
  const form = useFormContext()
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: `renglones.${indexForm}.seriales`,
  })
  console.log(isAutoSerialEnabled, 'isAutoSerialEnabled')
  useEffect(() => {
    replace(Array.from({ length: quantity }))
  }, [quantity, replace])

  return (
    <div className="flex flex-col gap-0 p-8 overflow-y-auto">
      <CardHeader>
        <CardTitle>Seriales</CardTitle>
        <CardDescription>Ingresa los seriales de la recepción</CardDescription>
      </CardHeader>
      {fields.map((item, index) => (
        <div key={item.id}>
          <FormField
            control={form.control}
            name={`renglones.${indexForm}.seriales.${index}.serial`}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Serial #{index + 1}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      if (form.formState.errors[field.name]) {
                        form.clearErrors(field.name)
                      }
                      form.setValue(field.name, e.target.value, {
                        shouldDirty: true,
                      })
                    }}
                    value={
                      field.value ||
                      (isAutoSerialEnabled
                        ? form.setValue(field.name, v4(), {
                            shouldDirty: true,
                          })
                        : '') ||
                      ''
                    }
                    // disabled={isAutoSerialEnabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  )
}
