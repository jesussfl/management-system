'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
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
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Input } from '@/modules/common/components/input/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useRouter } from 'next/navigation'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { Proveedor } from '@prisma/client'
import { createSupplier, updateSupplier } from '../../lib/actions/suppliers'

type FormValues = Proveedor
interface Props {
  defaultValues?: FormValues
}

export default function SuppliersForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const {
    control,
    handleSubmit,
    formState,
    watch,
    unregister,
    setValue,
    ...rest
  } = useForm<FormValues>({
    defaultValues,
  })
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const { isDirty, dirtyFields } = useFormState({ control: control })
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createSupplier(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Error',
              description: data.error,
              variant: 'destructive',
            })
          }
          if (data?.success) {
            toast({
              title: 'Proveedor creado',
              description: 'El proveedor se ha creado correctamente',
              variant: 'success',
            })

            router.back()
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

      const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues
      //check if dirtyValues has undefined values and convert them to null

      Object.keys(dirtyValues).forEach((key) => {
        if (dirtyValues[key as keyof FormValues] === undefined) {
          // @ts-ignore
          dirtyValues[key] = null
        }
      })

      updateSupplier(dirtyValues, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Proveedor actualizado',
            description: 'El proveedor se ha actualizado correctamente',
            variant: 'success',
          })
          router.back()
        }
      })
    })
  }

  return (
    <Form
      watch={watch}
      control={control}
      formState={formState}
      setValue={setValue}
      handleSubmit={handleSubmit}
      unregister={unregister}
      {...rest}
    >
      <form
        className=" space-y-10 mb-[8rem] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Complete la información solicitada para agregar al proveedor
            </CardTitle>
            <CardDescription>Llene los campos solicitados.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <div className="flex gap-4">
              <FormField
                control={control}
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
                  <FormItem className="flex-1">
                    <FormLabel>Nombre del Proveedor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="descripcion"
                rules={{
                  required: 'Este campo es necesario',
                  minLength: {
                    value: 10,
                    message: 'Debe tener al menos 10 carácteres',
                  },
                  maxLength: {
                    value: 300,
                    message: 'Debe tener un máximo de 300 carácteres',
                  },
                }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <textarea
                        id="description"
                        rows={3}
                        className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Esta descripción ayudará a entender rápidamente a este
                      proveedor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-b border-base-300" />
            <div className="flex gap-4">
              <FormField
                control={control}
                name={`telefono`}
                rules={{
                  required: 'Este campo es requerido',
                }}
                render={({ field: { ref, ...field } }) => (
                  <FormItem>
                    <FormLabel>{`Numero telefónico:`}</FormLabel>

                    <FormControl>
                      <PhoneInput
                        country={'ve'}
                        // placeholder="Ingresa tu numero telefónico"
                        {...field}
                        masks={{
                          ve: '....-...-....',
                        }}
                        onChange={(value: string, data: any) => {
                          const phoneNumber = value.split(data.dialCode)[1]
                          const formattedPhoneNumber = `+${
                            data.dialCode
                          }-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(
                            4,
                            7
                          )}-${phoneNumber.slice(7)}`
                          field.onChange(formattedPhoneNumber)
                        }}
                        countryCodeEditable={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`telefono_secundario`}
                render={({ field: { ref, ...field } }) => (
                  <FormItem>
                    <FormLabel>{`Numero telefónico secundario:`}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        country={'ve'}
                        // placeholder="Ingresa tu numero telefónico"
                        {...field}
                        masks={{
                          ve: '....-...-....',
                        }}
                        onChange={(value: string, data: any) => {
                          const phoneNumber = value.split(data.dialCode)[1]
                          const formattedPhoneNumber = `+${
                            data.dialCode
                          }-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(
                            4,
                            7
                          )}-${phoneNumber.slice(7)}`
                          field.onChange(formattedPhoneNumber)
                        }}
                        countryCodeEditable={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-b border-base-300" />
            <div className="flex gap-4">
              <FormField
                control={control}
                name={`direccion`}
                rules={{
                  required: 'Este campo es requerido',
                }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{`Dirección:`}</FormLabel>

                    <FormControl>
                      <Input type="text" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Correo:`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`sitio_web`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Sitio web:`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button variant="default" type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  )
}
