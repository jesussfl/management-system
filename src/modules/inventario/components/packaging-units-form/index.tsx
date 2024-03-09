'use client'
import * as React from 'react'

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
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { Input } from '@/modules/common/components/input/input'
import { UnidadEmpaque } from '@prisma/client'
import {
  createPackagingUnit,
  updatePackagingUnit,
} from '@/lib/actions/packaging-units'
import { Combobox } from '@/modules/common/components/combobox'
import { getAllCategories } from '@/lib/actions/categories'
interface Props {
  defaultValues?: UnidadEmpaque
  close?: () => void
}
const MEDIDAS = [
  { label: 'LITROS', value: 'LITROS' },
  { label: 'UNIDADES', value: 'UNIDADES' },
  { label: 'MILILITROS', value: 'MILILITROS' },
  { label: 'KILOGRAMOS', value: 'KILOGRAMOS' },
  { label: 'GRAMOS', value: 'GRAMOS' },
  { label: 'ONZAS', value: 'ONZAS' },
  { label: 'TONELADAS', value: 'TONELADAS' },
  { label: 'LIBRAS', value: 'LIBRAS' },
]
type ComboboxData = {
  value: number
  label: string
}
type FormValues = Omit<UnidadEmpaque, 'id'>

export default function PackagingUnitsForm({ defaultValues, close }: Props) {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    defaultValues,
  })
  const [isPending, startTransition] = React.useTransition()
  const [categories, setCategories] = React.useState<ComboboxData[]>([])
  React.useEffect(() => {
    startTransition(() => {
      getAllCategories().then((data) => {
        const transformedData = data.map((categorie) => ({
          value: categorie.id,
          label: categorie.nombre,
        }))

        setCategories(transformedData)
      })
    })
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (defaultValues) {
      React.startTransition(() => {
        updatePackagingUnit(defaultValues.id, values).then((data) => {
          if (data?.success) {
            toast({
              title: 'Unidad de empaque actualizada',
              description:
                'La Unidad de empaque se ha actualizado correctamente',
              variant: 'success',
            })
            close && close()
          }
        })
      })
    } else {
      React.startTransition(() => {
        createPackagingUnit(values).then((data) => {
          if (data?.error) {
            form.setError(data.field as any, {
              type: 'custom',
              message: data.error,
            })
          }

          if (data?.success) {
            toast({
              title: 'Unidad de empaque creada',
              description: 'La Unidad de empaque se ha creado correctamente',
              variant: 'success',
            })
            close && close()
          }
        })
      })
    }
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-scroll p-6 gap-8 mb-32"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DialogHeader className="pb-3 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Agrega una nueva unidad de empaque
          </DialogTitle>
        </DialogHeader>
        <div className="px-24">
          <FormField
            control={form.control}
            name="id_categoria"
            rules={{
              required: 'Es necesario seleccionar una categoría',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>¿A qué categoría pertenece?</FormLabel>
                <Combobox
                  name={field.name}
                  data={categories}
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
                      form.setValue(field.name, e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Da contexto de lo que este permiso visualiza o modifica
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
                <FormDescription>
                  Da contexto para ayudar a entender este permiso y el efecto
                  que puede tener.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo_medida"
            rules={{
              required: 'Este campo es requerido',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>Tipo de peso</FormLabel>
                <Combobox
                  name={field.name}
                  data={MEDIDAS}
                  form={form}
                  field={field}
                  isValueString={true}
                />
                <FormDescription></FormDescription>
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
                value: 8,
                message: 'Debe tener un maximo de 8 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Abreviacion del peso</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? field.value.toUpperCase() : ''}
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
                  Este campo es util para identificar la unidad de peso
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'peso'}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>{'Peso de la unidad (Opcional)'} </FormLabel>
                <FormDescription>
                  Este campo es util si la unidad de empaque tiene un peso fijo
                </FormDescription>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    value={Number(field.value).toFixed(2) || ''}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value).toFixed(2))
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          {form.formState.errors.descripcion && (
            <p className="text-sm font-medium text-destructive">
              Corrige los campos en rojo
            </p>
          )}

          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
var validate = function (e: any) {
  var t = e.value
  e.value = t.indexOf('.') >= 0 ? t.slice(0, t.indexOf('.') + 3) : t
}
