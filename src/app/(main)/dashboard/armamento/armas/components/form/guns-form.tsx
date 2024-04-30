'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Input } from '@/modules/common/components/input/input'
import { Armamento } from '@prisma/client'
import { getAllClassifications } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/classifications'
import { Combobox } from '@/modules/common/components/combobox'
import { useRouter } from 'next/navigation'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { ComboboxData } from '@/types/types'
import { createGun } from '../../lib/actions/guns'
import { Calendar } from '@/modules/common/components/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { cn } from '@/utils/utils'
import { getAllUnits } from '@/app/(main)/dashboard/unidades/lib/actions/units'
import { getAllWarehouses } from '@/app/(main)/dashboard/abastecimiento/almacenes/lib/actions/warehouse'
interface Props {
  defaultValues?: Armamento
}

type FormValues = Armamento

export default function GunsForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const [models, setModels] = React.useState<ComboboxData[]>([])
  const [units, setUnits] = React.useState<ComboboxData[]>([])
  const [warehouses, setWarehouses] = React.useState<ComboboxData[]>([])
  const form = useForm<FormValues>({
    defaultValues,
  })

  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    startTransition(() => {
      getAllClassifications().then((data) => {
        const transformedData = data.map((classification) => ({
          value: classification.id,
          label: classification.nombre,
        }))

        setModels(transformedData)
      })

      getAllUnits().then((data) => {
        const transformedData = data.map((unit) => ({
          value: unit.id,
          label: unit.nombre,
        }))

        setUnits(transformedData)
      })

      getAllWarehouses().then((data) => {
        const transformedData = data.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.nombre,
        }))

        setWarehouses(transformedData)
      })
    })
  }, [])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createGun(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Parece que hubo un problema',
              description: data.error,
              variant: 'destructive',
            })

            return
          }

          if (data?.success) {
            toast({
              title: 'Categoria creada',
              description: 'La categoria se ha creado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })

        return
      }

      if (!isDirty) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }

      const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues

      // updateCategory(defaultValues.id, dirtyValues).then((data) => {
      //   if (data?.success) {
      //     toast({
      //       title: 'Categoria actualizada',
      //       description: 'La categoria se ha actualizado correctamente',
      //       variant: 'success',
      //     })
      //   }
      //   router.back()
      // })
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto p-6 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          <FormField
            control={form.control}
            name="id_modelo"
            rules={{
              required: 'Es necesario seleccionar un modelo',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>¿A qué modelo de arma pertenece?</FormLabel>
                <Combobox
                  name={field.name}
                  data={models}
                  form={form}
                  field={field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serial_armazon"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Serial del armazón</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serial_canon"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Serial del Cañon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lugar_fabricacion"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Lugar de Fabricación</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condicion"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Condición</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estado"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numero_causa"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Numero de Causa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`fecha_fabricacion`}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormItem className="flex flex-row flex-1 items-center gap-5 ">
                <div className="w-[20rem]">
                  <FormLabel>Fecha de fabricación</FormLabel>
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
          <FormField
            control={form.control}
            name="id_unidad"
            rules={{
              required: 'Es necesario seleccionar un modelo',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>¿En qué unidad se encuentra?</FormLabel>
                <Combobox
                  name={field.name}
                  data={units}
                  form={form}
                  field={field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_almacen"
            rules={{
              required: 'Es necesario seleccionar un modelo',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>¿En qué almacen se encuentra?</FormLabel>
                <Combobox
                  name={field.name}
                  data={warehouses}
                  form={form}
                  field={field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
