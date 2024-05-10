'use client'

import { useTransition } from 'react'

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
import { signup } from '@/app/(auth)/lib/actions/signup'
import { signIn } from 'next-auth/react'
import { validatePassword } from '@/utils/helpers/validate-password'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Tipos_Cedulas } from '@prisma/client'
type FormValues = {
  email: string
  password: string
  confirmPassword: string
  name: string
  adminPassword: string
  cedula: string
  tipo_cedula: Tipos_Cedulas
}

export function CredentialsSignupForm() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    mode: 'all',
  })
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      signup(values).then((data) => {
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
          signIn('credentials', {
            email: values.email,
            password: values.password,
            callbackUrl: '/dashboard',
          })
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
                    <SelectItem value="R">R</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`cedula`}
            rules={{
              required: 'Este campo es requerido',
              minLength: 5,
              maxLength: 30,
            }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{`Documento de identidad`}</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
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
          name="adminPassword"
          rules={{
            required: 'Contraseña de administrador requerida',
            validate: validateAdminPassword,
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Contraseña del administrador</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isPending}
                  placeholder="**********"
                />
              </FormControl>
              <FormDescription>
                Pide a tu administrador una contraseña para poder registrarte.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Registrarme
        </Button>
      </form>
    </Form>
  )
}
