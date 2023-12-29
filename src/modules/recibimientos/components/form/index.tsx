'use client'
import { useCallback, useState } from 'react'
import { Input } from '@/modules/common/components/input/input'
import { Combobox } from '@/modules/common/components/combobox'
import { columns } from '../../../../app/(main)/dashboard/abastecimiento/recibimientos/agregar/columns'
import { cn } from '@/lib/utils'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
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
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { Calendar } from '@/modules/common/components/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { DataTable } from '@/modules/common/components/table/data-table'

interface Props {
  id?: number
  defaultValues?: Renglon
  renglonesData: Renglon[]
}

type TData = Renglon

const createRecibimiento = async (data: TData) => {
  const response = await fetch('http://localhost:3000/api/recibimiento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    console.log('success')
  }
}

export default function RecibimientosForm({
  id,
  defaultValues,
  renglonesData,
}: Props) {
  const form = useForm({
    defaultValues: {
      fecha_recibimiento: '',
      motivo: 'holaa',
      cantidad: 0,
      manufacturing_date: '',
      expiration_date: '',
    },
  })
  const [renglones, setRenglones] = useState<Renglon[]>([])
  const handleChange = useCallback((data: TData[]) => {
    setRenglones(data)
  }, [])

  const onSubmit: SubmitHandler = async (data) => {
    const renglonesIds = renglones.map((renglon) => renglon.id)

    const recibimiento = {
      fecha_recibimiento: new Date(data.fecha_recibimiento).toISOString(),
      motivo: 'holaa',
      renglonesIds,
    }
    console.log(recibimiento)
    await createRecibimiento(recibimiento)
  }

  return (
    <Form {...form}>
      <form
        className='className="flex-1 overflow-y-auto px-6 py-6"'
        onSubmit={form.handleSubmit(onSubmit as any)}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="fecha_recibimiento"
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormItem className="sm:col-span-4">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      Escribe un poco como es el renglon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="cantidad"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-4">
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      {/* <FormDescription></FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturing_date"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Fecha de creación</FormLabel>
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
                                format(Date.parse(field.value), 'dd/MM/yyyy')
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Fecha de vencimiento</FormLabel>
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
                                format(Date.parse(field.value), 'dd/MM/yyyy')
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
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <DataTable
                  columns={columns}
                  data={renglonesData}
                  onSelectedRowsChange={handleChange}
                  isColumnFilterEnabled={false}
                />
              </FormControl>
            </div>
          </div>

          <div className=" pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                {/* <FormField
                  control={form.control}
                  name="classification"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Clasificación</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="sm:col-span-3">
                {/* <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Categoría</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="sm:col-span-4">
                {/* <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-4">
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa el tipo" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                {/* <FormField
                  control={form.control}
                  name="modelNumber"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-4">
                      <FormLabel>Número de Parte o Modelo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Numero de parte o modelo"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="sm:col-span-2">
                {/* <FormField
                  control={form.control}
                  name="presentation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Presentación</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="sm:col-span-2">
                {/* <FormField
                  control={form.control}
                  name="measureUnit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Unidad de Medida</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t border-border">
            <Button variant="outline">Cancelar</Button>

            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
