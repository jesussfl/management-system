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
  createGrade,
  getAllComponents,
  updateGrade,
} from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/ranks'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { GradosWithComponentesArray } from '@/types/types'
import MultipleSelector, {
  Option,
} from '@/modules/common/components/multiple-selector'

type FormValues = Omit<GradosWithComponentesArray, 'id'>

export default function GradesForm({
  defaultValues,
}: {
  defaultValues?: GradosWithComponentesArray
}) {
  const isEditEnabled = !!defaultValues

  //Toast
  const { toast } = useToast()
  const router = useRouter()

  //Form
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty } = useFormState({ control: form.control })
  //States
  const [isPending, startTransition] = React.useTransition()
  const [components, setComponents] = React.useState<Option[]>([])

  React.useEffect(() => {
    startTransition(() => {
      // Get components data and transform it to CheckboxType
      getAllComponents().then((data) => {
        const transformedData = data.map((component) => ({
          value: String(component.id),
          label: component.nombre,
        }))

        setComponents(transformedData)
      })
    })
  }, [form])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formattedValues = {
      ...values,
      componentes: values.componentes.map((componente) => ({
        id_componente: Number(componente.value),
      })),
    }

    console.log(values, 'formattedValues')

    startTransition(() => {
      if (!isEditEnabled) {
        createGrade(formattedValues).then((data) => {
          if (data?.error) {
            toast({
              title: 'Error',
              description: data.error,
              variant: 'destructive',
            })
          }
          if (data?.success) {
            toast({
              title: 'Grado creado',
              description: 'El Grado se ha creado correctamente',
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

      updateGrade(defaultValues.id, formattedValues).then((data) => {
        if (data?.error) {
          toast({
            title: 'Error',
            description: data.error,
            variant: 'destructive',
          })
        }
        if (data?.success) {
          toast({
            title: 'Grado actualizado',
            description: 'El Grado se ha actualizado correctamente',
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
        className="flex-1 overflow-y-scroll p-6 gap-8 mb-36"
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

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-8">
            <FormField
              control={form.control}
              name="abreviatura"
              rules={{
                required: 'Este campo es necesario',
                minLength: {
                  value: 2,
                  message: 'Debe tener al menos 2 carácteres',
                },
                maxLength: {
                  value: 8,
                  message: 'Debe tener un máximo de 8 carácteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Abreviatura</FormLabel>
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

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`orden`}
              rules={{
                required: 'El orden es requerido',
                min: {
                  value: 1,
                  message: 'El orden debe ser mayor a 0',
                },
                max: {
                  value: 999,
                  message: 'El orden no puede ser mayor a 999',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden:</FormLabel>

                  <div className="flex-1 w-full">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(event) =>
                          field.onChange(parseInt(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`componentes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Componentes</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    options={components}
                    placeholder="Selecciona los componentes relacionados"
                    emptyIndicator={
                      <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                        No hay componentes
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button disabled={isPending} variant="default" type="submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
