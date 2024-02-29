'use client'
import { useCallback, useState } from 'react'
import { Input } from '@/modules/common/components/input/input'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
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

import { Renglon, RenglonType } from '@/types/types'
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
import { Prisma, Recepcion, Recepciones_Renglones } from '@prisma/client'
import { createReception } from '@/lib/actions/receptions'

type RecepcionType = Prisma.RecepcionGetPayload<{
  include: { renglones: true }
}>
type Detalles = Omit<Recepciones_Renglones, 'id_recepcion'>

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
  const [selectedData, setSelectedData] = useState<Renglon[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  const handleTableSelect = useCallback(
    (lastSelectedRow: any) => {
      if (lastSelectedRow) {
        append({
          id_renglon: lastSelectedRow.id,
          cantidad: 0,
          fecha_fabricacion: new Date(),
          fecha_vencimiento: new Date(),
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
    createReception(data).then(() => {
      toast({
        title: 'Recepción creado',
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
          <Card className="flex flex-col gap-2 p-8">
            <CardTitle>
              Complete la información solicitada para la recepción de los
              renglones
            </CardTitle>

            <CardContent>
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
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <textarea
                        id="motivo"
                        rows={3}
                        className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Redacta el motivo por el cual se está recibiendo el
                      material, renglones, etc...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`fecha_recepcion`}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormItem className="items-center flex justify-between gap-2">
                    <FormLabel>Fecha de recibimiento</FormLabel>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
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
                        <PopoverContent className="w-auto p-0" align="start">
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
            </CardContent>
          </Card>

          <Card className="flex flex-col gap-2 p-8">
            <CardTitle>Selecciona los renglones recibidos</CardTitle>
            <CardDescription>
              Encuentra y elige los productos que se han recibido en el
              CESERLODAI. Usa la búsqueda para agilizar el proceso.
            </CardDescription>
            <CardContent>
              <DataTable
                columns={columns}
                data={renglonesData}
                onSelectedRowsChange={handleTableSelect}
                isColumnFilterEnabled={false}
                selectedData={selectedItems}
                setSelectedData={setSelectedItems}
              />
            </CardContent>
          </Card>
          <Card className="flex flex-col gap-2 p-8">
            <CardTitle>
              Detalle la información de cada renglón seleccionado
            </CardTitle>
            <CardDescription></CardDescription>
            <CardContent>
              <div className="flex flex-row-reverse gap-4">
                <Card className="flex flex-col gap-2">
                  <CardHeader>
                    <CardTitle className="text-md font-medium text-foreground">
                      Detalles Generales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-row justify-between gap-4">
                      <p className="text-sm font-medium text-foreground">
                        Total de productos seleccionados:{' '}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedData.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-col flex-1 gap-4">
                  {selectedData.map((item, index) => (
                    <Card
                      key={item.id}
                      className="flex flex-col justify-between"
                    >
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-4">
                          <div className="flex items-center justify-center h-12 w-12 bg-border rounded-sm">
                            <Box className="h-6 w-6 "></Box>
                          </div>
                          <div>
                            <CardTitle className="text-md font-medium text-foreground">
                              {item.nombre}
                            </CardTitle>
                            <CardDescription>
                              {item.descripcion}
                            </CardDescription>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            deleteItem(index)
                          }}
                          className="flex items-center justify-center h-9 w-9 cursor-pointer bg-red-200 rounded-sm "
                        >
                          <Trash className="h-4 w-4 text-red-800 " />
                        </div>
                      </CardHeader>
                      <CardContent>
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
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <FormItem className="items-center flex justify-between gap-2">
                              <FormLabel>Fecha de fabricación:</FormLabel>
                              <div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'w-[240px] pl-3 text-left font-normal',
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
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <FormItem className="items-center flex justify-between gap-2">
                              <FormLabel>Fecha de vencimiento:</FormLabel>
                              <div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'w-[240px] pl-3 text-left font-normal',
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-end gap-4 w-full py-4">
          <Button variant="default" type={'submit'}>
            Guardar recibimiento
          </Button>
        </div>
      </form>
    </Form>
  )
}
