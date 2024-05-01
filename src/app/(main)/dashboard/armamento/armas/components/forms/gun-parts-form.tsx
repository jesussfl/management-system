'use client'
import { useState, useEffect, useTransition } from 'react'

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
import { Accesorio_Arma, Parte_Arma } from '@prisma/client'
import { getAllClassifications } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/classifications'
import { Combobox } from '@/modules/common/components/combobox'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createAccessory } from '../../lib/actions/accesories'
import { ComboboxData } from '@/types/types'
import { getAllGunModels } from '../../lib/actions/model-actions'
import { createGunPart } from '../../lib/actions/parts'
interface Props {
  defaultValues?: Parte_Arma
}

type FormValues = Parte_Arma

export default function GunPartsForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = useTransition()

  const [models, setModels] = useState<ComboboxData[]>([])

  useEffect(() => {
    startTransition(() => {
      getAllGunModels().then((data) => {
        const transformedData = data.map((model) => ({
          value: model.id,
          label: model.nombre,
        }))

        setModels(transformedData)
      })
    })
  }, [])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createGunPart(values).then((data) => {
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
              title: 'Parte Creada',
              description: 'La parte se ha creado correctamente',
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

      //   const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues

      //   updateCategory(defaultValues.id, dirtyValues).then((data) => {
      //     if (data?.success) {
      //       toast({
      //         title: 'Accesorio actualizado',
      //         description: 'El accesorio se ha actualizado correctamente',
      //         variant: 'success',
      //       })
      //     }
      //     router.back()
      //   })
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
              required: 'Es necesario seleccionar un modelo de arma',
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
                <FormLabel>Nombre de la parte</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                    className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe la parte de la manera mas detallada posible para
                  tener una mejor búsqueda
                </FormDescription>
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
