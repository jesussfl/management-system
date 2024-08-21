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
import { Subsistema } from '@prisma/client'
import { Combobox } from '@/modules/common/components/combobox'
import { useRouter } from 'next/navigation'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { Loader2 } from 'lucide-react'
import { getAllSystems } from '@/lib/actions/systems'
import { createSubsystem, updateSubsystem } from '@/lib/actions/subsystems'

interface Props {
  defaultValues?: Subsistema
}
type ComboboxData = {
  value: number
  label: string
}

export default function SubsystemForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const [systems, setSystems] = React.useState<ComboboxData[]>([])
  const form = useForm<Subsistema>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    startTransition(() => {
      getAllSystems().then((data) => {
        const transformedData = data.map((classification) => ({
          value: classification.id,
          label: classification.nombre,
        }))

        setSystems(transformedData)
      })
    })
  }, [])
  const onSubmit: SubmitHandler<Subsistema> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createSubsystem(values).then((data) => {
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
              title: 'Subsistema creado',
              description: 'El subsistema se ha creado correctamente',
              variant: 'success',
            })

            router.back()
            router.refresh()
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

      const dirtyValues = getDirtyValues(dirtyFields, values) as Subsistema
      updateSubsystem(defaultValues.id, dirtyValues).then((data) => {
        if (data?.success) {
          toast({
            title: 'Subsistema actualizado',
            description: 'El subsistema se ha actualizado correctamente',
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
        className="mb-36 flex-1 gap-8 overflow-y-auto p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          <FormField
            control={form.control}
            name="id_sistema"
            rules={{
              required: 'Es necesario seleccionar un sistema',
            }}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>¿A qué sistema pertenece?</FormLabel>
                <Combobox
                  name={field.name}
                  data={systems}
                  form={form}
                  field={field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
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
                  Es necesario que el nombre sea descriptivo
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
                  Describe el sistema de la manera mas detallada posible para
                  tener una mejor búsqueda
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
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
