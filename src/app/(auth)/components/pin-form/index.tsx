'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'

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
import { validatePin } from '@/app/(auth)/lib/actions/login'
import { NumericFormat } from 'react-number-format'

type FormValues = {
  pin: string
}

function PinForm({ facialId }: { facialId: string }) {
  const { toast } = useToast()
  const form = useForm<FormValues>()
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      validatePin(values.pin, facialId)
        .then((data) => {
          if (data?.error) {
            if (data.field === 'password' || data.field === 'pin') {
              form.setError('pin', {
                type: 'custom',
                message: data.error,
              })
            }

            if (data.field === null) {
              toast({
                title:
                  typeof data.error !== 'string'
                    ? 'Algo ha salido mal'
                    : data.error,
                variant: 'destructive',
              })
              return
            }
          }

          if (data?.success) {
            form.reset()
            toast({
              title: `Inicio de sesión exitoso`,
              variant: 'success',
            })
          }
        })
        .catch((err) =>
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
        <div className="flex flex-col gap-2 itmes-center justify-center">
          <FormField
            control={form.control}
            name="pin"
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
              <FormItem>
                <FormLabel>Ingrese el Pin de desbloqueo</FormLabel>

                <FormControl>
                  <NumericFormat
                    className="rounded-md w-full border-1 border-border  text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

          <Button disabled={isPending} type="submit" size={'xl'}>
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Iniciar sesión
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PinForm
