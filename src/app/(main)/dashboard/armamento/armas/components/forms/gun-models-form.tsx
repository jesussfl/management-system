'use client'
import { useState, useEffect, useTransition } from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
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
import { Modelo_Armamento } from '@prisma/client'
import { Combobox } from '@/modules/common/components/combobox'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ComboboxData } from '@/types/types'
import { getAllGunTypes } from '../../lib/actions/type'
import { createGunModel, updateGunModel } from '../../lib/actions/model-actions'
import { getAllGunBrands } from '../../lib/actions/brand'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { CheckIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { cn } from '@/utils/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { getAllGunCalibers } from '../../lib/actions/calibre'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
interface Props {
  defaultValues?: Modelo_Armamento
}

type FormValues = Modelo_Armamento

export default function GunModelsForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = useTransition()

  const [gunTypes, setGunTypes] = useState<ComboboxData[]>([])
  const [brands, setBrands] = useState<ComboboxData[]>([])
  const [calibers, setCalibers] = useState<ComboboxData[]>([])
  useEffect(() => {
    startTransition(() => {
      getAllGunTypes().then((data) => {
        const transformedData = data.map((gunType) => ({
          value: gunType.id,
          label: gunType.nombre,
        }))

        setGunTypes(transformedData)
      })

      getAllGunBrands().then((data) => {
        const transformedData = data.map((brand) => ({
          value: brand.id,
          label: brand.nombre,
        }))

        setBrands(transformedData)
      })

      getAllGunCalibers().then((data) => {
        const transformedData = data.map((caliber) => ({
          value: caliber.id,
          label: caliber.nombre,
        }))

        setCalibers(transformedData)
      })
    })
  }, [])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createGunModel(values).then((data) => {
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
              title: 'Modelo Creado',
              description: 'El modelo de arma se ha creado correctamente',
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

      updateGunModel(dirtyValues, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Modelo de arma actualizado',
            description: 'El modelo de arma se ha actualizado correctamente',
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
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="id_calibre"
              rules={{ required: 'Este campo es requerido' }}
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1 w-full">
                  <FormLabel>¿A qué calibre de arma pertenece?</FormLabel>
                  <Combobox
                    name={field.name}
                    data={calibers}
                    form={form}
                    field={field}
                  />

                  <FormDescription>
                    <Link
                      href="/dashboard/armamento/armas/calibre"
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'h-[1px] text-xs'
                      )}
                    >
                      Crear calibre
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_marca"
              rules={{ required: 'Este campo es requerido' }}
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1 w-full">
                  <FormLabel>¿A qué marca de arma pertenece?</FormLabel>
                  <Combobox
                    name={field.name}
                    data={brands}
                    form={form}
                    field={field}
                  />

                  <FormDescription>
                    <Link
                      href="/dashboard/armamento/armas/marca"
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'h-[1px] text-xs'
                      )}
                    >
                      Crear marca
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="id_tipo_armamento"
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 w-full">
                <FormLabel>¿A qué tipo de arma pertenece?</FormLabel>
                <Combobox
                  name={field.name}
                  data={gunTypes}
                  form={form}
                  field={field}
                />

                <FormDescription>
                  <Link
                    href="/dashboard/armamento/armas/tipo"
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'h-[1px] text-xs'
                    )}
                  >
                    Crear tipo de arma
                  </Link>
                </FormDescription>
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
                <FormLabel>Nombre del modelo de arma</FormLabel>
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
