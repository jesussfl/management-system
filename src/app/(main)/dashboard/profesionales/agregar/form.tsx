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
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { FormMilitar } from './form-militar'
import { useRouter } from 'next/navigation'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { Profesional_Abastecimiento } from '@prisma/client'
import {
  createProfessional,
  updateProfessional,
} from '../lib/actions/professionals'

type FormValues = Profesional_Abastecimiento
interface Props {
  defaultValues?: FormValues
}

export default function ProfessionalsForm({ defaultValues }: Props) {
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
        createProfessional(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Error',
              description: data.error,
              variant: 'destructive',
            })
          }
          if (data?.success) {
            toast({
              title: 'Profesional creado',
              description: 'El Profesional se ha creado correctamente',
              variant: 'success',
            })

            router.replace('/dashboard/profesionales')
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
      updateProfessional(dirtyValues, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Profesional actualizado',
            description: 'El Profesional se ha actualizado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/profesionales')
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
              Complete la información solicitada para agregar al profesional
            </CardTitle>
            <CardDescription>Llene los campos solicitados</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <div className="flex gap-12">
              <FormField
                control={control}
                name="tipo_cedula"
                rules={{
                  required: 'Tipo de cédula es requerido',
                }}
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
                control={control}
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
            <div className="border-b border-base-300" />
            <div className="flex gap-4">
              <FormField
                control={control}
                name={`nombres`}
                rules={{
                  required: 'Este campo es requerido',
                }}
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
                control={control}
                name={`apellidos`}
                rules={{
                  required: 'Este campo es requerido',
                }}
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
              control={control}
              name={`telefono`}
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="items-center flex flex-1 justify-between gap-2">
                  <FormLabel className="mb-3">{`Numero telefónico:`}</FormLabel>
                  <div className="w-[70%]">
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
                  </div>
                </FormItem>
              )}
            />
            <div className="border-b border-base-300" />
            <FormField
              control={control}
              name="sexo"
              rules={{ required: 'Este campo es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
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
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormMilitar />

            <div className="border-b border-base-300" />
            <FormField
              control={control}
              name={`direccion`}
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="items-center flex flex-1 justify-between gap-4">
                  <FormLabel className="mb-3">{`Dirección:`}</FormLabel>
                  <div className="w-[70%]">
                    <FormControl>
                      <Input type="text" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`cargo_profesional`}
              render={({ field }) => (
                <FormItem className="items-center flex flex-1 justify-between gap-4">
                  <FormLabel className="mb-3">{`Cargo Profesional:`}</FormLabel>
                  <div className="w-[70%]">
                    <FormControl>
                      <Input type="text" {...field} value={field.value || ''} />
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
