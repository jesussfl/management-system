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
import { signup } from '@/lib/actions/signup'
import { signIn } from 'next-auth/react'
import { validatePassword } from '@/utils/helpers/validate-password'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
type FormValues = {
  email: string
  password: string
  confirmPassword: string
  name: string
  adminPassword: string
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: 'Este campo es requerido',
            minLength: {
              value: 3,
              message: 'El nombre de usuario debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 40,
              message: 'El nombre de usuario no puede ser tan largo',
            },
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Nombre y apellido</FormLabel>
              <FormControl>
                <Input type="text" {...field} disabled={isPending} />
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
