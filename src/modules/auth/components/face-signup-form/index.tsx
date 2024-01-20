'use client'

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
import { handleEmailValidation } from '@/utils/helpers/validate-email'
import { signupByFacialID, getAllUsers } from '@/lib/actions/signup'
import { signIn } from 'next-auth/react'

import { useFaceio } from '@/lib/hooks/use-faceio'
import { errorMessages, fioErrCode } from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
type FormValues = {
  email: string
  name: string
  adminPassword: string
}

export function FaceSignupForm() {
  const { toast } = useToast()
  const { faceioRef } = useFaceio()
  const form = useForm<FormValues>()

  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { email, name, adminPassword } = values

    try {
      let response = await faceioRef.current
        .enroll({
          locale: 'es',
          payload: {
            email: `${values.email}`,
          },
          permissionTimeout: 15,
          enrollIntroTimeout: 4,
        })
        .catch((error: fioErrCode) => {
          console.log(error)

          const errorMessage = errorMessages[error] || error.toString()
          toast({
            title: 'Parece que hubo un error',
            description: errorMessage,
            variant: 'destructive',
            action: (
              <ToastAction
                altText="Intentar de nuevo"
                onClick={() => {
                  window.location.reload()
                }}
              >
                Recargar página
              </ToastAction>
            ),
          })
        })

      console.log(` Unique Facial ID: ${response.facialId}
      Enrollment Date: ${response.timestamp}
      Gender: ${response.details.gender}
      Age Approximation: ${response.details.age}`)

      startTransition(() => {
        signupByFacialID({
          email,
          facialID: response.facialId,
          adminPassword,
          name,
        }).then((data) => {
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
              email,
              facialID: response.facialId,
              callbackUrl: '/dashboard',
            })
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  const deleteFacialId = async () => {
    startTransition(() => {
      getAllUsers().then((users) => {
        users &&
          users.map((user) => {
            if (!user.facialID) return
            console.log(user.facialID)
            const url =
              'https://api.faceio.net/deletefacialid?fid=' +
              user.facialID +
              '&key=' +
              process.env.NEXT_PUBLIC_FACEIO_API_KEY

            console.log(url)
            user.facialID &&
              fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }).then((response) => {
                if (response.status === 200) {
                  console.log(
                    'Facial ID, datos de carga útil y hash biométrico eliminados de esta aplicación'
                  )
                }
                if (response.status !== 200) {
                  console.error(response.status)
                }
              })
          })
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
            required: true,
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
            required: true,
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
        <div className="flex flex-col-reverse gap-2 mt-4">
          <Button
            variant={'destructive'}
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              deleteFacialId()
            }}
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Borrar mi facial ID
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Crear ID Facial
          </Button>
        </div>
      </form>
    </Form>
  )
}