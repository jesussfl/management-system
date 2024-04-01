'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Input } from '@/modules/common/components/input/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { DestinatarioType } from '@/types/types'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { createReceiver } from '@/lib/actions/receivers'
import { Step2 } from './form-step-2'
import { useRouter } from 'next/navigation'

type FormValues = Omit<DestinatarioType, 'id'>
interface Props {
  defaultValues?: FormValues
}

export default function ReceiversForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const form = useForm<FormValues>({
    defaultValues,
  })
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const { isDirty, dirtyFields } = useFormState({ control: form.control })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createReceiver(values).then((data) => {
          if (data?.error) {
            form.setError(data.field as any, {
              type: 'custom',
              message: data.error,
            })
          }
          if (data?.success) {
            toast({
              title: 'Destinatario creado',
              description: 'El destinatario se ha creado correctamente',
              variant: 'success',
            })

            router.replace('/dashboard/abastecimiento/destinatarios')
          }
        })

        return
      }

      if (!isDirty) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className=" space-y-10 mb-[8rem] "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Complete la información solicitada para agregar al destinatario
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para el despacho de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <div className="flex gap-12">
              <FormField
                control={form.control}
                name="tipo_cedula"
                render={({ field }) => (
                  <FormItem className="flex flex-1 items-center gap-4 justify-between">
                    <FormLabel className="mb-3">Tipo de cédula</FormLabel>
                    <div className="w-[70%]">
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
                          <SelectItem value="R">R</SelectItem>
                          <SelectItem value="P">P</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`cedula`}
                rules={{
                  required: 'Este campo es requerido',
                  minLength: 5,
                  maxLength: 30,
                }}
                render={({ field }) => (
                  <FormItem className=" flex flex-1 items-center justify-between gap-4">
                    <FormLabel className="mb-3">{`Cédula`}</FormLabel>

                    <div className="w-[70%]">
                      <FormControl>
                        <Input
                          type="text"
                          onInput={(e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9]/g, '')
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Step2 />
            <div className="border-b border-base-300" />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name={`nombres`}
                render={({ field }) => (
                  <FormItem className="items-center flex flex-1 gap-4">
                    <FormLabel className="mb-3">{`Nombres:`}</FormLabel>
                    <div className="flex-1 w-full">
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`apellidos`}
                render={({ field }) => (
                  <FormItem className="items-center flex flex-1 justify-between gap-4">
                    <FormLabel className="mb-3">{`Apellidos:`}</FormLabel>
                    <div className="flex-1 w-full">
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="border-b border-base-300" />
            <FormField
              control={form.control}
              name={`telefono`}
              render={({ field }) => (
                <FormItem className="items-center flex flex-1 justify-between gap-2">
                  <FormLabel className="mb-3">{`Numero telefónico:`}</FormLabel>
                  <div className="w-[70%]">
                    <FormControl>
                      <PhoneInput
                        country={'ve'}
                        // placeholder="Ingresa tu numero telefónico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="border-b border-base-300" />
            <Step2 />
            <div className="border-b border-base-300" />
            <FormField
              control={form.control}
              name={`situacion_profesional`}
              render={({ field }) => (
                <FormItem className="items-center flex flex-1 justify-between gap-4">
                  <FormLabel className="mb-3">{`Situación Profesional:`}</FormLabel>
                  <div className="w-[70%]">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button variant="default" type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  )
}
