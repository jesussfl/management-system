'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { cn } from '@/utils/utils'
import { buttonVariants } from '@/modules/common/components/button'
import { useSearchParams } from 'next/navigation'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
// @ts-ignore
import faceIO from '@faceio/fiojs'

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
import { login, loginByFacialID } from '@/lib/actions/login'
import { isValidEmail } from '@/utils/helpers/isValidEmail'
import { signIn } from 'next-auth/react'
type FormValues = {
  email: string
  password: string
}

function LoginForm() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
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
  const handleAuthenticate = async () => {
    try {
      if (!faceio) return
      // Call the authenticate method of the FaceIO instance with necessary options
      const response = await faceio.authenticate({
        locale: 'es',
      })
      // Log authentication details to the console
      console.log(
        `Unique Facial ID: ${response.facialId} PayLoad: ${response.payload}`
      )
      loginByFacialID({ facialID: response.facialId }, callbackUrl)
        .then((data) => {
          if (data?.error) {
            toast({
              title: 'Parece que hubo un error',
              description: data.error,
              variant: 'destructive',
            })
          }

          if (data?.success) {
            toast({
              title: 'Success',
              description: data.success,
              variant: 'success',
            })
          }
        })
        .catch((error) => {
          // Set error state if authentication fails
          console.error(error)
        })
    } catch (error) {
      // Set error state if authentication fails
    }
  }

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
    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset()
            form.setError(data.field as any, {
              type: 'custom',
              message: data.error,
            })
          }

          if (data?.success) {
            form.reset()
            toast({
              title: 'Success',
              description: data.success,
              variant: 'success',
            })
          }
        })
        .catch(() =>
          toast({
            title: 'Algo ha salido mal',
            variant: 'destructive',
            description: 'Error al iniciar sesión',
          })
        )
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
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Iniciar sesión
          </Button>
          <Button
            variant={'secondary'}
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              handleAuthenticate()
            }}
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reconocimiento Facial
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
