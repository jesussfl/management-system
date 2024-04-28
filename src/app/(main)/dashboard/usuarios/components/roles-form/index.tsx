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
import {
  createRol,
  updateRol,
} from '@/app/(main)/dashboard/usuarios/lib/actions/roles'

import { Input } from '@/modules/common/components/input/input'
import { getAllPermissions } from '../../lib/actions/permissions'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import MultipleSelector, {
  Option,
} from '@/modules/common/components/multiple-selector'
import { RolesWithPermissionsArray } from '@/types/types'
import { useRouter } from 'next/navigation'
import { Rol } from '@prisma/client'

type FormValues = Rol & { permisos: Option[] }
interface Props {
  defaultValues?: FormValues
}

export default function RolesForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const [permissions, setPermissions] = React.useState<Option[]>([])

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })

  React.useEffect(() => {
    getAllPermissions().then((permission) => {
      const formattedPermissions = permission.map((permiso) => ({
        value: permiso.key,
        label: permiso.permiso,
      }))

      setPermissions(formattedPermissions)
    })
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formattedValues = {
      ...values,
      permisos: values.permisos.map((permiso) => {
        return {
          permiso_key: permiso.value,
        }
      }),
    }
    if (values.permisos.length === 0) {
      toast({
        title: 'Seleccionar un permiso',
        description: 'Debe seleccionar al menos un permiso',
        variant: 'destructive',
      })
      return
    }

    if (!isEditEnabled) {
      createRol(formattedValues).then((data) => {
        if (data?.error) {
          form.setError(data.field as any, {
            type: 'custom',
            message: data.error,
          })
        }

        if (data?.success) {
          toast({
            title: 'Rol creado',
            description: 'El rol se ha creado correctamente',
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

    // const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues

    updateRol(defaultValues.id, formattedValues).then((data) => {
      if (data?.success) {
        toast({
          title: 'Rol actualizado',
          description: 'El rol se ha actualizado correctamente',
          variant: 'success',
        })

        router.back()
      }
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto px-8 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="rol"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 70,
              message: 'Debe tener un maximo de 70 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Escoje un nombre que sea sencillo de identificar y asignar, ej.
                Usuario Básico, Auditor.
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
                Describe el rol, incluyendo sus permisos, limitaciones y quién
                puede ser asignado
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name={`permisos`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permisos</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    options={permissions}
                    placeholder="Selecciona los permisos relacionados"
                    emptyIndicator={
                      <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                        No hay más permisos
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
