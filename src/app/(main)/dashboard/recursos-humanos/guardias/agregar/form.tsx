'use client'
import * as React from 'react'

import {
  useForm,
  SubmitHandler,
  useFormState,
  useFieldArray,
} from 'react-hook-form'
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
import 'react-phone-input-2/lib/style.css'
import { useRouter } from 'next/navigation'

import { Shield, Trash } from 'lucide-react'
import { GuardiasForm, updateGuard } from '../lib/actions'
import { getAllPersonnel } from '../../personal/lib/actions/professionals'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
type FormValues = GuardiasForm
interface Props {
  defaultValues?: GuardiasForm
  cedula: string
}
export default function GuardsForm({ defaultValues, cedula }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const {
    control,
    handleSubmit,
    formState,
    watch,
    unregister,
    setValue,
    trigger,
    ...rest
  } = useForm<FormValues>({
    defaultValues,
  })
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const { isDirty, dirtyFields } = useFormState({ control: control })

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: control,
    name: `guardias`,
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      updateGuard(values, cedula).then((data) => {
        if (data?.error) {
          toast({
            title: 'Error',
            description: data.error,
            variant: 'destructive',
          })
        }
        if (data?.success) {
          toast({
            title: 'Guardias creadas',
            description: 'La guardia se ha creado correctamente',
            variant: 'success',
          })

          router.replace('/dashboard/recursos-humanos/guardias')
        }
      })

      // const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues
      // //check if dirtyValues has undefined values and convert them to null
      // updatePersonnel(dirtyValues, defaultValues.id).then((data) => {
      //   if (data?.success) {
      //     toast({
      //       title: 'Personal actualizado',
      //       description: 'El Personal se ha actualizado correctamente',
      //       variant: 'success',
      //     })
      //     router.replace('/dashboard/recursos-humanos/personal')
      //   }
      // })
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
      trigger={trigger}
      {...rest}
    >
      <form
        className=" space-y-10 mb-[8rem] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium text-foreground">
              Complete la información solicitada para agregar guardias
            </CardTitle>
            <CardDescription>Llene los campos solicitados</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <Button
              variant="default"
              onClick={() =>
                append({
                  ubicacion: '',
                  fecha: new Date(),
                  estado: '',
                })
              }
            >
              Añadir fecha
            </Button>
            <div className="grid xl:grid-cols-2 gap-4">
              {fields.map((field, index) => {
                return (
                  <Card
                    key={field.id}
                    className={`flex flex-col gap-4
              }`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-4 items-center">
                        <Shield className="h-6 w-6 " />
                        <div>
                          <CardTitle className="text-md font-medium text-foreground">
                            {`Asignar guardia`}
                          </CardTitle>
                        </div>
                      </div>

                      <Trash
                        onClick={() => remove(index)}
                        className="h-5 w-5 text-red-800 cursor-pointer"
                      />
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 justify-start">
                      <FormField
                        control={control}
                        name={`guardias.${index}.fecha`}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de la guardia</FormLabel>
                            <FormDescription>
                              Selecciona la fecha en la que será la guardia.
                            </FormDescription>
                            <Input
                              type="datetime-local"
                              id="fecha_despacho"
                              {...field}
                              value={
                                field.value
                                  ? format(
                                      new Date(field.value),
                                      "yyyy-MM-dd'T'HH:mm"
                                    )
                                  : ''
                              }
                              onBlur={() => {
                                trigger(`guardias.${index}.fecha`)
                              }}
                              onChange={(e) => {
                                if (!e.target.value) {
                                  //@ts-ignore
                                  setValue(`guardias.${index}.fecha`, null)
                                  return
                                }

                                setValue(
                                  `guardias.${index}.fecha`,
                                  new Date(e.target.value)
                                )
                              }}
                              className="w-full"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`guardias.${index}.ubicacion`}
                        rules={{
                          maxLength: {
                            value: 125,
                            message:
                              'La ubicación no puede superar los 125 caracteres',
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{`Ubicación:`}</FormLabel>

                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`guardias.${index}.estado`}
                        rules={{
                          required: 'El estado es requerido',
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado de la guardia</FormLabel>
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
                                <SelectItem value="Pendiente">
                                  Pendiente
                                </SelectItem>
                                <SelectItem value="Realizada">
                                  Realizada
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )
              })}
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
