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
import {
  Armamento,
  Colores_Armamento,
  Condiciones_Armamento,
  Estados_Armamento,
} from '@prisma/client'
import { Combobox } from '@/modules/common/components/combobox'
import { useRouter } from 'next/navigation'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { ComboboxData } from '@/types/types'
import { createGun, updateGun } from '../../lib/actions/guns'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
interface Props {
  defaultValues?: Armamento
  warehouses: ComboboxData[]
  units: ComboboxData[]
  models: ComboboxData[]
}

type FormValues = Armamento

export default function GunsForm({
  defaultValues,
  warehouses,
  units,
  models,
}: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues,
  })

  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

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
              title: 'Armamento agregado',
              description: 'El armamento se ha agregado correctamente',
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
      updateGun(dirtyValues, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Armamento actualizado',
            description: 'El armamento se ha actualizado correctamente',
            variant: 'success',
          })
        }
        router.back()
      })
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Complete la información solicitada para el registro del armamento
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para el correcto registro
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 w-full">
            <FormField
              control={form.control}
              name="id_modelo"
              rules={{
                required: 'Es necesario seleccionar un modelo',
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2 justify-center">
                  <FormLabel>Modelo de Arma: </FormLabel>
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
              name="condicion"
              rules={{
                required: 'Este campo es necesario',
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-1 mt-1.5">
                  <FormLabel>Condición:</FormLabel>
                  <Combobox
                    name={field.name}
                    data={Object.keys(Condiciones_Armamento).map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    form={form}
                    field={field}
                    isValueString
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_unidad"
              rules={{
                required: 'Es necesario seleccionar una unidad',
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full ">
                  <FormLabel>Unidad: </FormLabel>
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
                required: 'Es necesario seleccionar un almacen',
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full ">
                  <FormLabel>Almacén: </FormLabel>
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
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
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
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-1 mt-1.5">
                  <FormLabel>Color:</FormLabel>
                  <Combobox
                    name={field.name}
                    data={Object.keys(Colores_Armamento).map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    form={form}
                    field={field}
                    isValueString
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lugar_fabricacion"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Lugar de Fabricación (Opcional):</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pasillo"
              rules={{
                maxLength: {
                  value: 100,
                  message: 'Debe tener un maximo de 100 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Pasillo (Opcional):</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
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
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-1 mt-1.5">
                  <FormLabel>Estado del Armamento:</FormLabel>
                  <Combobox
                    name={field.name}
                    data={Object.keys(Estados_Armamento).map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    form={form}
                    field={field}
                    isValueString
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numero_causa"
              rules={{
                maxLength: {
                  value: 100,
                  message: 'Debe tener un maximo de 100 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Numero de Causa (Opcional):</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`fecha_fabricacion`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de fabricación (Opcional):</FormLabel>

                  <DatePicker
                    placeholderText="Seleccionar fecha"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    locale={es}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
