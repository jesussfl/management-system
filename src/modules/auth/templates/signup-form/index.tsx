'use client'

import * as React from 'react'
import { useTransition } from 'react'

import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'

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
import { isValidEmail } from '@/utils/helpers/isValidEmail'
import { signup } from '@/lib/actions/signup'
import { signIn } from 'next-auth/react'
type FormValues = {
  email: string
  password: string
  confirmPassword: string
  name: string
  adminPassword: string
}

export function SignupForm() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      adminPassword: '',
    },
  })

  const [isPending, startTransition] = useTransition()
  const handleEmailValidation = (email: string) => {
    console.log('ValidateEmail was called with', email)

    const isValid = isValidEmail(email)

    const validityChanged =
      (form.formState.errors.email && isValid) ||
      (!form.formState.errors.email && !isValid)
    if (validityChanged) {
      console.log('Fire tracker with', isValid ? 'Valid' : 'Invalid')
    }

    return isValid ? true : 'El email no es valido'
  }
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'custom',
        message: 'Las contraseñas no coinciden',
      })
      return
    }

    if (values.adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      form.setError('adminPassword', {
        type: 'custom',
        message: 'Contraseña de administrador incorrecta',
      })
      return
    }

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
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 3,
                message:
                  'El nombre de usuario debe tener al menos 3 caracteres',
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
            rules={{ required: 'Contraseña requerida' }}
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
                  La contraseña debe contener al menos 8 carácteres y 2
                  especiales
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{ required: 'Contraseña requerida' }}
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
            rules={{ required: 'Contraseña de administrador requerida' }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Contraseña de administrador</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    disabled={isPending}
                    placeholder="**********"
                  />
                </FormControl>
                <FormDescription>
                  Es necesario para validar el acceso al panel de administración
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Registrarme
          </Button>
        </div>
      </form>
    </Form>
  )
}
