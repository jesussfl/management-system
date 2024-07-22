'use client'

import { useEffect, useState, useTransition } from 'react'

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
  checkIfUserExists,
  signupByFacialIDByAdmin,
} from '@/app/(auth)/lib/actions/signup'

import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Tipos_Cedulas } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { ComboboxData } from '@/types/types'
import { getAllRoles } from '@/app/(main)/dashboard/usuarios/lib/actions/roles'
import { Combobox } from '@/modules/common/components/combobox'
import { NumericFormat } from 'react-number-format'
type FormValues = {
  email: string
  name: string
  adminPassword: string
  tipo_cedula: Tipos_Cedulas
  cedula: string
  rol: number
  facial_pin: string
}

export function FaceSignupForm() {
  const { toast } = useToast()
  const { faceio } = useFaceio()
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

    const { email, name, cedula, rol, tipo_cedula } = values

    try {
      let response = await faceio
        .enroll({
          locale: 'es',
          payload: {
            pin: `${values.facial_pin}`,
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

      startTransition(() => {
        signupByFacialIDByAdmin({
          email,
          rol,
          facialID: response.facialId,
          name,
          cedula,
          tipo_cedula,
        }).then(async (data) => {
          if (data?.error) {
            form.setError(data.field as any, {
              type: 'custom',
              message: data.error,
            })
          }

          if (data?.success) {
            try {
              const res = await fetch(
                `/api/set-facial-pin?facialId=${response.facialId}&facialPin=${values.facial_pin}`,
                {
                  method: 'POST',
                }
              )

              const data = await res.json()

              if (res.status === 200) {
                console.log('Facial pin asignado')
              } else {
                console.error(data.error)
              }
            } catch (error) {
              console.error('Error:', error)
            }

            toast({
              title: 'ID Facial Asignado',
              description: 'El usuario se ha actualizado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <FormField
          control={form.control}
          name="facial_pin"
          rules={{
            required: 'El pin es requerido',
            minLength: {
              value: 4,
              message: 'El pin debe tener al menos 4 caracteres',
            },
            maxLength: {
              value: 16,
              message: 'El pin debe tener al menos 16 caracteres',
            },
          }}
          render={({
            field: { ref, onChange, ...rest },
            fieldState: { error },
          }) => (
            <FormItem className="mb-4">
              <FormLabel>Pin de desbloqueo</FormLabel>
              <FormDescription>
                Se te solicitará este pin de desbloqueo más adelante
              </FormDescription>
              <FormControl>
                <NumericFormat
                  className="rounded-md border-1 border-border mb-4 text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  allowNegative={false}
                  thousandSeparator=""
                  prefix=""
                  decimalScale={0}
                  maxLength={16}
                  getInputRef={ref}
                  onValueChange={({ value }) => onChange(value)}
                  {...rest}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 mt-4">
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
        </div>
      </form>
    </Form>
  )
}
