'use client'
import * as React from 'react'

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
import { Almacen, Unidad_Militar } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import { createWarehouse, updateWarehouse } from '../../lib/actions/warehouse'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { Combobox } from '@/modules/common/components/combobox'
import { getAllUnits } from '@/app/(main)/dashboard/unidades/lib/actions/units'
import { ComboboxData } from '@/types/types'
import Link from 'next/link'
import { cn } from '@/utils/utils'

interface Props {
  defaultValues?: Almacen
}

type FormValues = Almacen

export default function WarehousesForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()
  const [units, setUnits] = React.useState<ComboboxData[]>([])

  React.useEffect(() => {
    startTransition(() => {
      getAllUnits().then((data) => {
        const transformedData = data.map((unit) => ({
          value: unit.id,
          label: unit.nombre,
        }))
        setUnits(transformedData)
      })
    })
  }, [])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createWarehouse(values).then((data) => {
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
              title: 'Almacén creado',
              description: 'El almacén se ha creado correctamente',
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
      updateWarehouse(defaultValues.id, dirtyValues).then((data) => {
        if (data?.success) {
          toast({
            title: 'Almacén actualizado',
            description: 'El almacén se ha actualizado correctamente',
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
                <FormLabel>Nombre</FormLabel>
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
            name="ubicacion"
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
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id_unidad"
            rules={{
              required: 'Es necesario seleccionar una unidad',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>¿En qué unidad se encuentra?</FormLabel>
                <Combobox
                  name={field.name}
                  data={units}
                  form={form}
                  field={field}
                />
                <FormMessage />
                <FormDescription>
                  <Link
                    href="/dashboard/unidades/agregar"
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'text-sm h-[30px]'
                    )}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Unidad
                  </Link>
                </FormDescription>
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
