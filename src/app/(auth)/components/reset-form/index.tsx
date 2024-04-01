'use client'

import * as z from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { ResetSchema } from '@/utils/schemas'
import { Input } from '@/modules/common/components/input/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { CardWrapper } from '@/app/(auth)/components/card-wrapper'
import { Button } from '@/modules/common/components/button'

import { reset } from '@/app/(auth)/lib/actions/reset'
import { useToast } from '@/modules/common/components/toast/use-toast'

export const ResetForm = () => {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [expiryDate, setExpiryDate] = useState(new Date())
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (expiryDate > new Date()) {
      setSecondsLeft(
        Math.round((expiryDate.getTime() - new Date().getTime()) / 1000)
      )
      const intervalId = setInterval(() => {
        setSecondsLeft((secondsLeft) => secondsLeft - 1)
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [expiryDate])
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      reset(values).then((data) => {
        if (data?.error) {
          toast({
            variant: 'destructive',
            description: data?.error,
            title: 'Parece que hubo un problema',
          })
        }

        if (data?.success) {
          setExpiryDate(data.expires)
          toast({
            variant: 'success',
            description: 'Email enviado con exito',
            title: 'Email enviado con exito',
          })
        }
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Olvidaste tu contraseña?"
      backButtonLabel="Volver al inicio de sesión"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@ejemplo.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {secondsLeft > 0
              ? `Espere ${secondsLeft} segundos para reenviar el email`
              : 'Reenviar email'}
          </p>
          <Button
            disabled={isPending || secondsLeft > 0}
            type="submit"
            className="w-full"
          >
            Enviar email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
