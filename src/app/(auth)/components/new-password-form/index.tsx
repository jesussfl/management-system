'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { NewPasswordSchema } from '@/utils/schemas'
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
import { useToast } from '@/modules/common/components/toast/use-toast'
import { newPassword } from '@/app/(auth)/lib/actions/new-password'
export const NewPasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const token = searchParams.get('token')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data?.error) {
          toast({
            title: 'Parece que hubo un error',
            description: data.error,
            variant: 'destructive',
          })
        }
        if (data?.success) {
          toast({
            title: 'Contraseña actualizada',
            description: 'La contraseña se ha actualizado correctamente',
            variant: 'success',
          })
          router.push('/auth/login')
        }
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Ingresa tu nueva contraseña"
      backButtonLabel="Volver al login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} type="submit" className="w-full">
            Reiniciar contraseña
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
