'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  loginByFacialID,
  validateFacialId,
  validateUser,
} from '@/app/(auth)/lib/actions/login'
import { handleEmailValidation } from '@/utils/helpers/validate-email'
import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
import { checkInTime, checkOutTime } from '../../lib/actions'
import Link from 'next/link'
import { cn } from '@/utils/utils'

type FormValues = {
  email: string
  password: string
}

function ValidationForm({
  type,
  close,
}: {
  type: 'entrada' | 'salida'
  close?: () => void
}) {
  const { toast } = useToast()
  const { faceio } = useFaceio()
  const form = useForm<FormValues>()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const authenticateByFacialID = async () => {
    try {
      close && close()

      const response = await faceio
        ?.authenticate({
          locale: 'es',
        })
        .catch((error: faceioErrorCode) => {
          const errorMessage = errorMessages[error] || error.toString()

          if (error === faceioErrorCode.UNRECOGNIZED_FACE) {
            window.location.href = '/auth/signup?error=unrecognizedFace'
            return
          }

          if (error === faceioErrorCode.SESSION_EXPIRED) {
            toast({
              title: 'Por favor refresca la página',
              variant: 'destructive',
            })
            return
          }

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

      const validationResponse = await validateFacialId(response.facialId)
      if (validationResponse?.error) {
        toast({
          title: 'Parece que hubo un error',
          description: validationResponse.error,
          variant: 'destructive',
        })
        return
      }

      if (validationResponse?.success && validationResponse.user) {
        if (type === 'entrada') {
          const response = await checkInTime(validationResponse.user)

          if (response?.error) {
            toast({
              title: 'Parece que hubo un error',
              description: response.error,
              variant: 'destructive',
            })
            router.replace(
              `/asistencias/consulta/${validationResponse.user.id}`
            )

            return
          }

          if (response?.success) {
            toast({
              title: 'Entrada registrada',
              variant: 'success',
            })
            router.replace(
              `/asistencias/consulta/${validationResponse.user.id}`
            )

            return
          }
        }

        if (type === 'salida') {
          const response = await checkOutTime(validationResponse.user)

          if (response?.error) {
            toast({
              title: 'Parece que hubo un error',
              description: response.error,
              variant: 'destructive',
            })
            router.replace(
              `/asistencias/consulta/${validationResponse.user.id}`
            )

            return
          }

          if (response?.success) {
            toast({
              title: 'Salida registrada',
              variant: 'success',
            })

            router.replace(
              `/asistencias/consulta/${validationResponse.user.id}`
            )
            return
          }
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true)
    const validationResponse = await validateUser(values)

    if (validationResponse?.error) {
      toast({
        title: 'Parece que hubo un error',
        description: validationResponse.error,
        variant: 'destructive',
      })
      return
    }

    if (validationResponse?.success && validationResponse.user) {
      if (type === 'entrada') {
        const response = await checkInTime(validationResponse.user)

        if (response?.error) {
          toast({
            title: 'Parece que hubo un error',
            description: response.error,
            variant: 'destructive',
          })
          router.replace(`/asistencias/consulta/${validationResponse.user.id}`)

          return
        }

        if (response?.success) {
          toast({
            title: 'Entrada registrada',
            variant: 'success',
          })
          router.replace(`/asistencias/consulta/${validationResponse.user.id}`)

          return
        }
      }

      if (type === 'salida') {
        const response = await checkOutTime(validationResponse.user)

        if (response?.error) {
          toast({
            title: 'Parece que hubo un error',
            description: response.error,
            variant: 'destructive',
          })
          router.replace(`/asistencias/consulta/${validationResponse.user.id}`)

          return
        }

        if (response?.success) {
          toast({
            title: 'Salida registrada',
            variant: 'success',
          })
          router.replace(`/asistencias/consulta/${validationResponse.user.id}`)

          return
        }
      }
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="validation-form">
        <div className="flex flex-col gap-2">
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
                  <Input type="email" {...field} disabled={isLoading} />
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
                    disabled={isLoading}
                    placeholder="**********"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/reset"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-green-600'
              )}
            >
              Olvidé mi contraseña
            </Link>
          </div>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verificar credenciales
          </Button>

          <Button
            variant={'secondary'}
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              authenticateByFacialID()
            }}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            ID Facial
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ValidationForm
