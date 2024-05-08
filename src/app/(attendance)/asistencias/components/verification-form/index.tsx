'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { cn } from '@/utils/utils'
import { buttonVariants } from '@/modules/common/components/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  login,
  loginByFacialID,
  validateUser,
} from '@/app/(auth)/lib/actions/login'
import { handleEmailValidation } from '@/utils/helpers/validate-email'
import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
import { Usuario } from '@prisma/client'
import {
  createAttendance,
  getAttendancesByUserId,
  getLastAttendanceByUserId,
  updateAttendance,
} from '@/app/(main)/dashboard/recursos-humanos/asistencias/lib/actions'
import { isSameDay } from 'date-fns'

type FormValues = {
  email: string
  password: string
}
const checkInTime = async (user: Usuario) => {
  console.log('checkAttendance')

  if (!user || !user.id) {
    return {
      error: 'No se pudo encontrar el usuario',
      success: false,
    }
  }

  // Obtener las asistencias del usuario para el día de hoy
  const today = new Date()
  const lastAttendance = await getLastAttendanceByUserId(user.id)
  console.log('lastAttendance', lastAttendance)
  const todayAttendance = lastAttendance?.hora_entrada
    ? isSameDay(new Date(lastAttendance.hora_entrada), today)
    : false

  // Si no hay asistencia para hoy, crear un nuevo registro
  if (!todayAttendance) {
    console.log('No hay asistencia para hoy')
    await createAttendance({ id_usuario: user.id, hora_entrada: new Date() })

    return {
      success: 'Asistencia registrada',
      error: false,
    }
  }

  return {
    error: 'Ya registraste una asistencia para hoy',
    success: false,
  }
}
const checkOutTime = async (user: Usuario) => {
  if (!user || !user.id) {
    return {
      error: 'No se pudo encontrar el usuario',
      success: false,
    }
  }

  // Obtener las asistencias del usuario para el día de hoy
  const today = new Date()

  const lastAttendance = await getLastAttendanceByUserId(user.id)

  const todayAttendance = lastAttendance?.hora_entrada
    ? isSameDay(new Date(lastAttendance.hora_entrada), today)
    : false

  const alreadyCheckedOut = lastAttendance?.hora_salida

  if (alreadyCheckedOut) {
    return {
      error: 'Ya registraste tu hora de salida',
      success: false,
    }
  }
  // Si hay asistencia de entrada para hoy, actualizar la hora de salida
  if (todayAttendance && lastAttendance) {
    await updateAttendance(lastAttendance.id, {
      hora_salida: new Date(),
    })

    return {
      success: 'Hora de salida registrada',
      error: false,
    }
  }

  return {
    error:
      'Por favor registra tu hora de entrada antes de registrar tu hora de salida',
    success: false,
  }
}
function ValidationForm({ type }: { type: 'entrada' | 'salida' }) {
  const { toast } = useToast()
  const { faceio } = useFaceio()
  const form = useForm<FormValues>()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const authenticateByFacialID = async () => {
    try {
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
      console.log(response)
      loginByFacialID({ facialID: response.facialId }, callbackUrl).then(
        (res) => {
          if (res?.error) {
            toast({
              title: 'Parece que hubo un error',
              description: res.error,
              variant: 'destructive',
            })
          }

          if (res?.success) {
            toast({
              title: res.success,
              variant: 'success',
            })
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      validateUser(values).then((validation) => {
        if (validation?.error) {
          toast({
            title: 'Parece que hubo un error',
            description: validation.error,
            variant: 'destructive',
          })

          return
        }
        if (validation?.success && validation.user) {
          if (type === 'entrada') {
            checkInTime(validation.user).then((data) => {
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
                  title: 'Hora de entrada registrada',
                  variant: 'success',
                })
              }
            })
          }

          if (type === 'salida') {
            checkOutTime(validation.user).then((data) => {
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
                  title: 'Hora de salida registrada',
                  variant: 'success',
                })
              }
            })
          }
          router.replace(`/asistencias/consulta/${validation.user.id}`)
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
            name="email"
            rules={{
              required: 'Este campo es requerido',
              validate: handleEmailValidation,
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isPending} />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verificar credenciales
          </Button>

          <Button
            variant={'secondary'}
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              authenticateByFacialID()
            }}
          >
            {isPending && (
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
