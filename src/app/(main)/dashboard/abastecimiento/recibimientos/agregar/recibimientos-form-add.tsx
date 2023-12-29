'use client'
import { useCallback, useState } from 'react'
import { Input } from '@/modules/common/components/input/input'

import { columns } from './columns'
import { cn } from '@/lib/utils'
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  FieldValues,
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

import { Renglon } from '@/types/types'
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

type FormProps = {
  renglonesData: Renglon[]
}
type Detalles = {
  id_renglon: number
  cantidad: number
  fecha_fabricacion: Date
  fecha_vencimiento: Date
}

type FormValues = {
  fecha_recibimiento: Date
  motivo: string
  detalles: Detalles[]
}

export default function RecibimientosFormAdd({ renglonesData }: FormProps) {
  const form = useForm<FormValues>()
  const router = useRouter()
  const { toast } = useToast()
  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `detalles`,
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
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (selectedData.length === 0) {
        return
      }
    }

    if (currentStep === 2) {
      if (fields.length === 0) {
        return
      }
    }
    setCurrentStep((prev) => prev + 1)
  }
  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1)
  }
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
    createRecibimiento(data).then(() => {
      toast({
        title: 'Recibimiento creado',
        description: 'El recibimiento se ha creado correctamente',
        variant: 'default',
      })
      router.replace('/dashboard/abastecimiento/recibimientos')
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between flex-1 overflow-y-auto "
      >
        <div className="p-5 space-y-12 mt-5 mb-[8rem]">
          {currentStep === 1 && (
            <>
              <h3 className="text-center text-md font-medium text-foreground">
                Selecciona los renglones que se recibieron
              </h3>
              <DataTable
                columns={columns}
                data={renglonesData}
                onSelectedRowsChange={handleTableSelect}
                isColumnFilterEnabled={false}
                selectedData={selectedItems}
                setSelectedData={setSelectedItems}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <h3 className="text-center text-md font-medium text-foreground">
                Detalle la información de cada renglón seleccionado
              </h3>
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
                          name={`detalles.${index}.cantidad`}
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
                                {/* <FormDescription></FormDescription> */}
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.fecha_fabricacion`}
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
                                      selected={new Date(field.value)}
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
                          name={`detalles.${index}.fecha_vencimiento`}
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
                                      selected={new Date(field.value)}
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
            </>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col flex-1 gap-4">
              <FormField
                control={form.control}
                name={`motivo`}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormItem className="items-center flex justify-between gap-2">
                    <FormLabel>Motivo</FormLabel>
                    <div>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      {/* <FormDescription></FormDescription> */}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`fecha_recibimiento`}
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
            </div>
          )}
        </div>
        <div className="sticky bottom-0 flex justify-between p-5 border-t border-border bg-background">
          <div className="flex items-center gap-4">
            <Button
              variant="destructive"
              size={'sm'}
              onClick={(e) => {
                e.preventDefault()
                setCurrentStep(1)
              }}
            >
              Cancelar
            </Button>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-foreground">
                Agregar nuevo recibimiento
              </h1>
              <p className="text-xs text-muted-foreground">
                Paso {currentStep} de {'3'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={'outline'}
              size={'sm'}
              disabled={currentStep === 1}
              onClick={(e) => {
                e.preventDefault()
                handleBackStep()
              }}
            >
              Anterior
            </Button>
            <Button
              variant="default"
              size={'sm'}
              type={currentStep === 3 ? 'submit' : 'button'}
              onClick={(e) => {
                if (currentStep < 3) {
                  e.preventDefault()
                  handleNextStep()
                }
              }}
            >
              {currentStep < 3 ? 'Siguiente' : 'Guardar recibimiento'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
