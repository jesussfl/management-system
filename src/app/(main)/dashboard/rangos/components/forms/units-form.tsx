'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { Input } from '@/modules/common/components/input/input'
import { Categoria_Militar, Unidad_Militar } from '@prisma/client'
interface Props {
  defaultValues?: Unidad_Militar
  close?: () => void
}

type FormValues = {
  nombre: string
  descripcion: string
}

export default function UnitsForm({ defaultValues, close }: Props) {
  const { toast } = useToast()

  const form = useForm<FormValues>({
    defaultValues,
  })
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (defaultValues) {
      React.startTransition(() => {
        // updateClassification(defaultValues.id, values).then((data) => {
        //   if (data?.success) {
        //     toast({
        //       title: 'Permiso actualizado',
        //       description: 'El permiso se ha actualizado correctamente',
        //       variant: 'success',
        //     })
        //     close && close()
        //   }
        // })
      })
    } else {
      React.startTransition(() => {
        // createClassification(values).then((data) => {
        //   if (data?.error) {
        //     form.setError(data.field as any, {
        //       type: 'custom',
        //       message: data.error,
        //     })
        //   }
        //   if (data?.success) {
        //     toast({
        //       title: 'Permiso creado',
        //       description: 'El permiso se ha creado correctamente',
        //       variant: 'success',
        //     })
        //     close && close()
        //   }
        // })
      })
    }
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-scroll p-6 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DialogHeader className="pb-3 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Agrega una nueva categoría militar
          </DialogTitle>
        </DialogHeader>
        <div className="px-24">
          <FormField
            control={form.control}
            name="nombre"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Debe tener un maximo de 100 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      if (form.formState.errors[field.name]) {
                        form.clearErrors(field.name)
                      }
                      form.setValue(field.name, e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Da contexto de lo que este permiso visualiza o modifica
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 10,
                message: 'Debe tener al menos 10 carácteres',
              },
              maxLength: {
                value: 200,
                message: 'Debe tener un máximo de 200 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <textarea
                    id="description"
                    rows={3}
                    className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...field}
                    onChange={(e) => {
                      if (form.formState.errors[field.name]) {
                        form.clearErrors(field.name)
                      }
                      form.setValue(field.name, e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Da contexto para ayudar a entender este permiso y el efecto
                  que puede tener.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          {form.formState.errors.descripcion && (
            <p className="text-sm font-medium text-destructive">
              Corrige los campos en rojo
            </p>
          )}

          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
