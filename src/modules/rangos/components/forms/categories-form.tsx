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
import {
  createCategory,
  getAllGrades,
  updateCategory,
} from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/ranks'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import MultipleSelector, {
  Option,
} from '@/modules/common/components/multiple-selector'
import { CategoriasWithGradosArray } from '@/types/types'

interface Props {
  defaultValues?: CategoriasWithGradosArray
}

type FormValues = Omit<CategoriasWithGradosArray, 'id'>

export default function CategoriesForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

  const [grades, setGrades] = React.useState<Option[]>([])
  React.useEffect(() => {
    startTransition(() => {
      getAllGrades().then((data) => {
        const transformedData = data.map((grade) => ({
          value: String(grade.id),
          label: grade.nombre,
        }))

        setGrades(transformedData)
      })
    })
  }, [form])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formattedValues = {
      ...values,
      grados: values.grados.map((grado) => ({
        id_grado: Number(grado.value),
      })),
    }

    startTransition(() => {
      if (!isEditEnabled) {
        createCategory(formattedValues).then((data) => {
          if (data?.error) {
            toast({
              title: 'Parece que hubo un problema',
              description: data.error,
              variant: 'destructive',
            })
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
      updateCategory(defaultValues.id, formattedValues).then((data) => {
        if (data?.error) {
          toast({
            title: 'Parece que hubo un problema',
            description: data.error,
            variant: 'destructive',
          })
        }
        if (data?.success) {
          toast({
            title: 'Categoria actualizada',
            description: 'La categoria se ha actualizado correctamente',
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
            name={'grados'}
            rules={{ required: 'Este campo es necesario' }}
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Grados</FormLabel>
                  <FormDescription>
                    Selecciona los grados asociados a esta categoría .
                  </FormDescription>
                </div>
                <MultipleSelector
                  value={field.value}
                  onChange={field.onChange}
                  options={grades}
                  placeholder="Selecciona los grados relacionados"
                  emptyIndicator={
                    <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                      No hay grados
                    </p>
                  }
                />

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          {/* {form.formState.errors && (
            <p className="text-sm font-medium text-destructive">
              Corrige los campos en rojo
            </p>
          )} */}

          <Button disabled={isPending} variant="default" type="submit">
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
