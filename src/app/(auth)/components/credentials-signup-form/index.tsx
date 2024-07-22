'use client'

import { useEffect, useState, useTransition } from 'react'

import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
// @ts-ignore
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { handleEmailValidation } from '@/utils/helpers/validate-email'
import {
  checkIfUserExists,
  signup,
  signupByAdmin,
} from '@/app/(auth)/lib/actions/signup'
import { validatePassword } from '@/utils/helpers/validate-password'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Tipos_Cedulas } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ComboboxData } from '@/types/types'
import { getAllRoles } from '@/app/(main)/dashboard/usuarios/lib/actions/roles'
import { Combobox } from '@/modules/common/components/combobox'
type FormValues = {
  email: string
  password: string
  confirmPassword: string
  name: string
  adminPassword: string
  cedula: string
  rol: number
  tipo_cedula: Tipos_Cedulas
}

export function CredentialsSignupForm() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    mode: 'onChange',
  })
  const [isPending, startTransition] = useTransition()
  const [roles, setRoles] = useState<ComboboxData[]>([])
  useEffect(() => {
    getAllRoles(true).then((rol) => {
      const formattedRoles = rol.map((rol) => ({
        value: rol.id,
        label: rol.rol,
      }))

      setRoles(formattedRoles)
    })
  }, [form])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const exists = await checkIfUserExists(values.cedula)

    if (exists) {
      form.setError('cedula', {
        type: 'custom',
        message: 'El usuario ya existe',
      })

      return
    }

    startTransition(() => {
      signupByAdmin(values).then((data) => {
        if (data?.error) {
          form.setError(data.field as any, {
            type: 'custom',
            message: data.error,
          })
        }

        if (data?.success) {
          form.reset()
          toast({
            title: 'Exitoso',
            description: data.success,
            variant: 'success',
          })
          router.back()
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: 'Este campo es requerido',
            minLength: 3,
            maxLength: 150,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  disabled={isPending}
                  onInput={(e) =>
                    (e.currentTarget.value = e.currentTarget.value.replace(
                      /[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/g,
                      ''
                    ))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Este campo es requerido',
            validate: handleEmailValidation,
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="tipo_cedula"
            rules={{
              required: 'Tipo de documento es requerido',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento de identidad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="J">J</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`cedula`}
            disabled={!form.watch('tipo_cedula')}
            rules={{
              required: 'Este campo es requerido',
              validate: (value) => {
                const documentType = form.watch('tipo_cedula')
                if (documentType === 'V') {
                  return (
                    /^\d{7,8}$/.test(value) ||
                    'Debe ser un número de 7 a 8 dígitos'
                  )
                }
                if (documentType === 'E' || documentType === 'J') {
                  return (
                    /^\d{7,10}$/.test(value) ||
                    'Debe ser un número de 7 a 10 dígitos'
                  )
                }
                if (documentType === 'P') {
                  return (
                    /^[a-zA-Z0-9]{5,15}$/.test(value) ||
                    'Debe tener entre 5 y 15 caracteres alfanuméricos'
                  )
                }
                return true
              },
            }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{`Documento de identidad`}</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    className="flex-1"
                    onInput={(e) => {
                      const documentType = form.watch('tipo_cedula')
                      if (documentType !== 'P') {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ''
                        )

                        return
                      }
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^a-zA-Z0-9]{5,15}/g,
                        ''
                      )
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: true,
            validate: (value) => validatePassword({ value }),
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isPending}
                  placeholder="**********"
                />
              </FormControl>
              <FormDescription>
                La contraseña debe contener al menos 8 carácteres, una letra
                mayúscula, una letra minúscula, un número y un caracter especial
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: 'Contraseña requerida',
            validate: (value) => value === form.getValues('password'),
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isPending}
                  placeholder="**********"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Rol:</FormLabel>
              <Combobox
                name={field.name}
                data={roles}
                form={form}
                field={field}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.cedula && (
          <p className="text-sm text-red-500"> {`Corrija los errores`}</p>
        )}
        <Button disabled={isPending} type="submit">
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Agregar usuario
        </Button>
      </form>
    </Form>
  )
}
