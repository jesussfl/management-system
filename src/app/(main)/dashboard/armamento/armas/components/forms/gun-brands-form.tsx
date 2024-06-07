'use client'
import { useTransition } from 'react'

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
import { Marca_Armamento } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createGunBrand, updateGunBrand } from '../../lib/actions/brand'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
interface Props {
  defaultValues?: Marca_Armamento
}

type FormValues = Marca_Armamento

export default function GunBrandsForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createGunBrand(values).then((data) => {
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
              title: 'Marca de arma creada',
              description: 'La marca de arma se ha creado correctamente',
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

      updateGunBrand(dirtyValues, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Marca de arma actualizada',
            description: 'La marca de arma se ha actualizado correctamente',
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
                <FormLabel>Nombre de la marca</FormLabel>
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
