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
import { Prisma } from '@prisma/client'
import {
  createCategory,
  getAllGrades,
  updateCategory,
} from '@/lib/actions/ranks'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type CategoriaType = Prisma.Categoria_MilitarGetPayload<{
  include: { grados: true }
}>

interface Props {
  defaultValues?: CategoriaType
}

type FormValues = Omit<CategoriaType, 'id'>
type CheckboxType = {
  id: number
  label: string
}
export default function CategoriesForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

  const [grades, setGrades] = React.useState<CheckboxType[]>([])
  React.useEffect(() => {
    startTransition(() => {
      getAllGrades().then((data) => {
        const transformedData = data.map((grade) => ({
          id: grade.id,
          label: grade.nombre,
        }))

        setGrades(transformedData)
      })
    })
  }, [form])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formattedValues = {
      ...values,
      grados: values.grados.filter((grados) => !!grados.id_grado),
    }

    startTransition(() => {
      if (!isEditEnabled) {
        createCategory(formattedValues).then((data) => {
          if (data?.error) {
            form.setError(data.field as any, {
              type: 'custom',
              message: data.error,
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
          form.setError(data.field as any, {
            type: 'custom',
            message: data.error,
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
                      form.setValue(field.name, e.target.value)
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
                      form.setValue(field.name, e.target.value)
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
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Grados</FormLabel>
                  <FormDescription>
                    Selecciona los grados asociados a esta categoría .
                  </FormDescription>
                </div>
                {grades.map((grade, index) => (
                  <FormField
                    key={grade.id}
                    control={form.control}
                    name={`grados.${index}.id_grado`} // Nombre único para cada campo Checkbox
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={grade.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value ? true : false}
                              onCheckedChange={(value) => {
                                if (value) {
                                  field.onChange(grade.id)
                                } else {
                                  field.onChange('')
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {grade.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}

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
