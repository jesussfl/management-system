'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
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
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Input } from '@/modules/common/components/input/input'
import { UnidadEmpaque } from '@prisma/client'
import {
  createPackagingUnit,
  updatePackagingUnit,
} from '@/lib/actions/packaging-units'
import { Combobox } from '@/modules/common/components/combobox'
import { getAllCategories } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { NumericFormat } from 'react-number-format'

interface Props {
  defaultValues?: UnidadEmpaque
}
export const MEDIDAS = [
  { label: 'LITROS', value: 'LITROS', abreviation: 'LTS' },
  { label: 'MILILITROS', value: 'MILILITROS', abreviation: 'ML' },
  { label: 'KILOGRAMOS', value: 'KILOGRAMOS', abreviation: 'KG' },
  { label: 'GRAMOS', value: 'GRAMOS', abreviation: 'G' },
  { label: 'ONZAS', value: 'ONZAS', abreviation: 'ONZ' },
  { label: 'TONELADAS', value: 'TONELADAS', abreviation: 'TON' },
  { label: 'LIBRAS', value: 'LIBRAS', abreviation: 'LB' },
]
type ComboboxData = {
  value: number
  label: string
}
type FormValues = Omit<UnidadEmpaque, 'id'>

export default function PackagingUnitsForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })

  const [isPending, startTransition] = React.useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const measureType = form.watch('tipo_medida')
    const abreviation = MEDIDAS.find((m) => m.value === measureType)
      ?.abreviation
    const parsedValues = {
      ...values,
      abreviacion: abreviation,
      peso: Number(values.peso) || null,
    }

    startTransition(() => {
      if (!isEditEnabled) {
        createPackagingUnit(parsedValues).then((data) => {
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
              title: 'Unidad de empaque creada',
              description: 'La Unidad de empaque se ha creado correctamente',
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

      updatePackagingUnit(defaultValues.id, parsedValues).then((data) => {
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
            title: 'Unidad de empaque actualizada',
            description: 'La Unidad de empaque se ha actualizado correctamente',
            variant: 'success',
          })
          router.back()
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto p-6 gap-8 mb-32"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          <FormField
            control={form.control}
            name="nombre"
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
                <FormLabel>Nombre</FormLabel>
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
                  />
                </FormControl>
                <FormDescription>
                  El nombre debe ser lo más descriptivo posible
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
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
              <FormItem className="mb-8">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <textarea
                    id="description"
                    rows={3}
                    className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...field}
                    onChange={(e) => {
                      if (form.formState.errors[field.name]) {
                        form.clearErrors(field.name)
                      }
                      form.setValue(field.name, e.target.value, {
                        shouldDirty: true,
                      })
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Describe el empaque de manera clara y concisa
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-8">
            <FormField
              control={form.control}
              name="tipo_medida"
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel className="mb-[8px]">Unidad de Medida</FormLabel>

                  <Combobox
                    name={field.name}
                    data={MEDIDAS}
                    form={form}
                    field={field}
                    isValueString={true}
                  />
                  <FormDescription>
                    Selecciona en qué tipo de medida se maneja el empaque, Ej.
                    Una botella se maneja en litros.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'peso'}
              rules={{
                validate: (value) => {
                  const measureType = form.watch('tipo_medida')
                  const isMeasureTypeForLiquids =
                    measureType === 'LITROS' || measureType === 'MILILITROS'

                  if (isMeasureTypeForLiquids && !value)
                    return 'El empaque debe tener un peso'
                },
              }}
              render={({ field: { ref, ...rest } }) => (
                <FormItem className="flex-1">
                  <FormLabel>{'Peso estandar del empaque'} </FormLabel>

                  <FormControl>
                    <NumericFormat
                      className="w-[200px] rounded-md border-1 border-border p-1.5 text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      allowNegative={false}
                      thousandSeparator=""
                      decimalSeparator="."
                      prefix=""
                      decimalScale={2}
                      getInputRef={ref}
                      {...rest}
                    />
                  </FormControl>
                  <FormDescription>
                    Este campo es util si la unidad de empaque tiene un peso
                    estandar. Si el empaque no tendrá el mismo peso, debe dejar
                    este campo en blanco.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
          {form.formState.errors.descripcion && (
            <p className="text-sm font-medium text-destructive">
              Corrige los campos en rojo
            </p>
          )}

          <Button variant="default" type="submit" disabled={isPending}>
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
