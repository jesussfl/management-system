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
import {
  signupByFacialID,
  getAllUsers,
  checkIfUserExists,
} from '@/app/(auth)/lib/actions/signup'
import { signIn } from 'next-auth/react'

import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
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
  name: string
  adminPassword: string
  tipo_cedula: Tipos_Cedulas
  cedula: string
}

export function FaceSignupForm() {
  const { toast } = useToast()
  const { faceio } = useFaceio()
  const form = useForm<FormValues>()

  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { email, name, adminPassword, cedula, tipo_cedula } = values

    try {
      let response = await faceio
        .enroll({
          locale: 'es',
          payload: {
            email: `${values.email}`,
          },
          permissionTimeout: 15,
          enrollIntroTimeout: 4,
        })
        .catch((error: faceioErrorCode) => {
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
          cedula,
          tipo_cedula,
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
    console.log(
      'Deleting facial ID... ',
      process.env.NEXT_PUBLIC_FACEIO_API_KEY
    )
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
            required: true,
            validate: handleEmailValidation,
          }}
          render={({ field }) => (
            <FormItem>
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
                    onBlur={async () => {
                      const exists = await checkIfUserExists(field.value)

                      if (exists) {
                        toast({
                          title: 'El usuario ya está registrado',

                          variant: 'destructive',
                        })
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          {/* <Button
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
          </Button> */}
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
