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
import { Clasificacion } from '@prisma/client'
import {
  createClassification,
  updateClassification,
} from '@/lib/actions/classifications'
import { useRouter } from 'next/navigation'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { Loader2 } from 'lucide-react'
interface Props {
  defaultValues?: Clasificacion
  close?: () => void
}

export default function ClassificationsForm({ defaultValues, close }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<Clasificacion>({
    defaultValues,
  })
  const isEditEnabled = !!defaultValues
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

  const onSubmit: SubmitHandler<Clasificacion> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createClassification(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Error',
              description: data.error,
              variant: 'destructive',
            })

            return
          }

          if (data?.success) {
            toast({
              title: 'Clasificación creada',
              description: 'La clasificación se ha creado correctamente',
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
      const dirtyValues = getDirtyValues(dirtyFields, values) as Clasificacion
      updateClassification(defaultValues.id, dirtyValues).then((data) => {
        if (data?.success) {
          toast({
            title: 'Clasificación actualizada',
            description: 'La clasificación se ha actualizado correctamente',
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
        className="mb-36 flex-1 gap-8 overflow-y-auto p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          <div className="flex flex-row gap-4">
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
                    Se recomienda que el nombre sea descriptivo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abreviacion"
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
                  <FormLabel>Abreviación</FormLabel>
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
                      value={field.value || ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                message: 'Debe tener un máximo de 300 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full rounded-md border-0 bg-background p-1.5 text-foreground ring-1 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  Da contexto para ayudar a entender esta clasificación y así
                  asignar renglones de manera precisa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed bottom-0 right-0 w-full items-center gap-4 border-t border-border bg-white p-8 pt-4">
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
