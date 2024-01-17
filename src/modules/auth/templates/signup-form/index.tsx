'use client'

import * as React from 'react'
import { useTransition } from 'react'

import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
// @ts-ignore
import faceIO from '@faceio/fiojs'
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
import { signup, signupByFacialID } from '@/lib/actions/signup'
import { signIn } from 'next-auth/react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
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
  const [faceio, setFaceio] = React.useState<any>(null)
  React.useEffect(() => {
    const initializeFaceIO = async () => {
      try {
        // Create a new instance of FaceIO with your public ID
        const faceioInstance = new faceIO('fioaa043')
        // Update state with the instance
        setFaceio(faceioInstance)
      } catch (error) {
        // Set error state if initialization fails
      }
    }
    initializeFaceIO()
  }, [])
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
  const handleRegister = async () => {
    if (!faceio) return
    console.log('step 1')
    if (!form.getValues('email')) {
      console.log('Email is required')
      form.setError('email', {
        type: 'custom',
        message: 'El email es requerido',
      })
      return
    }

    if (!form.getValues('name')) {
      console.log('Name is required')
      form.setError('name', {
        type: 'custom',
        message: 'El nombre es requerido',
      })
      return
    }

    if (
      !form.getValues('adminPassword') ||
      form.getValues('adminPassword') !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      console.log('Password is required')
      form.setError('adminPassword', {
        type: 'custom',
        message: 'La contraseña de administrador es requerida',
      })
      return
    }

    try {
      let response = await faceio.enroll({
        locale: 'es',
        payload: {
          email: `${form.getValues('email')}`,
        },
      })

      console.log(` Unique Facial ID: ${response.facialId}
      Enrollment Date: ${response.timestamp}
      Gender: ${response.details.gender}
      Age Approximation: ${response.details.age}`)
      startTransition(() => {
        signupByFacialID({
          email: form.getValues('email'),
          facialID: response.facialId,
          adminPassword: form.getValues('adminPassword'),
          name: form.getValues('name'),
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
              email: form.getValues('email'),
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
  const deleteFacialId = async () => {
    const apiKey = 'd7ef215332d7c1bea7c805a08697d044' // Reemplaza con tu clave de API
    const facialIdToDelete = '96fd0cc6a3784e2090ee0f845350e498fioaa043' // Reemplaza con el ID facial que deseas eliminar

    fetch(
      `https://api.faceio.net/deletefacialid?fid=96fd0cc6a3784e2090ee0f845350e498fioaa043&key=d7ef215332d7c1bea7c805a08697d044`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((reply) => {
        if (reply.status !== 200) {
          console.error(reply.error)
          return
        }

        // Éxito
        console.log(
          'Facial ID, datos de carga útil y hash biométrico eliminados de esta aplicación'
        )
      })
      .catch((error) => {
        console.error('Error al eliminar el Facial ID:', error)
      })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs
          className="flex flex-col gap-2"
          defaultValue="Reconocimiento Facial"
        >
          <TabsList className="mx-5">
            <TabsTrigger
              onClick={() => form.reset()}
              value="Reconocimiento Facial"
            >
              Reconocimiento Facial
            </TabsTrigger>
            <TabsTrigger
              onClick={() => form.reset()}
              value="Correo y Contraseña"
            >
              Correo y Contraseña
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Reconocimiento Facial">
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
                    Es necesario para validar el acceso al panel de
                    administración
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={'secondary'}
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                handleRegister()
              }}
            >
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Vincular Rostro
            </Button>
          </TabsContent>
          <TabsContent value="Correo y Contraseña">
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
                    Es necesario para validar el acceso al panel de
                    administración
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
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
