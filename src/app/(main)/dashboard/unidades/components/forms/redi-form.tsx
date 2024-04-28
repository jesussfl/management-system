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
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { createRedi, updateRedi } from '../../lib/actions/redis'
import { Redi } from '@prisma/client'
type FormValues = Omit<Redi, 'id'>

export default function RedisForm({ defaultValues }: { defaultValues?: Redi }) {
  const isEditEnabled = !!defaultValues

  //Toast
  const { toast } = useToast()
  const router = useRouter()

  //Form
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  //States
  const [isPending, startTransition] = React.useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createRedi(values).then((data) => {
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
              title: 'Redi creada',
              description: 'La redi se ha creado correctamente',
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

      updateRedi(defaultValues.id, dirtyValues).then((data) => {
        if (data?.error) {
          toast({
            title: 'Error',
            description: data.error,
            variant: 'destructive',
          })
        }
        if (data?.success) {
          toast({
            title: 'Redi actualizada',
            description: 'La redi se ha actualizado correctamente',
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

          <div className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="descripcion"
              rules={{
                required: 'Este campo es necesario',
              }}
              render={({ field }) => (
                <FormItem className="">
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

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`ubicacion`}
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Ubicacion</FormLabel>
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
          </div>
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
