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
  createRol,
  updateRol,
} from '@/app/(main)/dashboard/usuarios/lib/actions/roles'

import { Input } from '@/modules/common/components/input/input'
import { useRouter } from 'next/navigation'
import { Rol } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Loader2, UserPlusIcon } from 'lucide-react'
import { PermissionsList } from './permissions-table-form'

type FormValues = Rol & { permisos: string[] }
interface Props {
  defaultValues?: FormValues
}

export default function RolesForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const form = useForm<FormValues>({
    defaultValues,
  })
  const [isPending, startTransition] = React.useTransition()

  const onCheckedChange = (key: string, value: boolean) => {
    const currentPermissions = form.getValues('permisos')
    if (value) {
      if (!currentPermissions) {
        form.setValue('permisos', [key])

        return
      }

      if (!currentPermissions.includes(key)) {
        form.setValue('permisos', [...currentPermissions, key])
      }
    }

    if (!value) {
      form.setValue(
        'permisos',
        currentPermissions?.filter((permiso) => permiso !== key)
      )
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!isEditEnabled) {
      startTransition(() => {
        createRol(values).then((data) => {
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
      })

      return
    }

    startTransition(() => {
      updateRol(defaultValues.id, values).then((data) => {
        if (data?.success) {
          toast({
            title: 'Rol actualizado',
            description: 'El rol se ha actualizado correctamente',
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
        className="relative flex flex-row overflow-y-auto px-8 gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex sticky top-24 left-0 flex-col gap-8 max-w-[400px]">
          <FormField
            control={form.control}
            name="nivel"
            rules={{
              required: 'Tipo de documento es requerido',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Seleccione el nivel de usuario para el rol:
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Jefe_de_departamento">
                      Jefe Administrador
                    </SelectItem>
                    <SelectItem value="Encargado">Encargado</SelectItem>
                    <SelectItem value="Personal_civil">
                      Personal Civil Básico
                    </SelectItem>
                    <SelectItem value="Personal_militar">
                      Personal Militar Básico
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
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
                  Escoje un nombre que sea sencillo de identificar y asignar,
                  ej. Usuario Básico, Auditor.
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
              <FormItem className="mb-36">
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
        </div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-md">
              Seleccione los permisos del rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionsList onCheckedChange={onCheckedChange} />
          </CardContent>
        </Card>

        <DialogFooter className="fixed right-0 bottom-0 bg-white border-t border-border gap-4 items-center w-full p-4">
          <Button disabled={isPending} variant="default" type="submit">
            {isPending ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <UserPlusIcon className="mr-2 h-4 w-4" />
            )}
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
