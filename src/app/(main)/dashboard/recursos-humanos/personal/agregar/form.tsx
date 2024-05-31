'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
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
import { Personal, Profesional_Abastecimiento, Usuario } from '@prisma/client'
import {
  checkIfPersonnelExists,
  createPersonnel,
  updatePersonnel,
} from '../lib/actions/professionals'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { cn } from '@/utils/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { getAllUsers } from '@/app/(auth)/lib/actions/signup'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'
import { CheckIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
type FormValues = Personal
interface Props {
  defaultValues?: FormValues
}
type ComboboxData = {
  value: string
  label: string
}
export default function PersonnelForm({ defaultValues }: Props) {
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
  const [users, setUsers] = React.useState<ComboboxData[]>([])
  const [isUsersLoading, setIsUsersLoading] = React.useState(false)
  React.useEffect(() => {
    setIsUsersLoading(true)
    getAllUsers().then((data) => {
      const transformedData = data.map((user) => ({
        value: user.cedula,
        label: `${user.tipo_cedula}-${user.cedula} - ${user.nombre}`,
      }))

      setUsers(transformedData)
    })
    setIsUsersLoading(false)
  }, [])

  const isMilitar = watch('tipo')
  React.useEffect(() => {
    if (isMilitar === 'Civil') {
      setValue('id_categoria', null, {
        shouldDirty: true,
      })
      setValue('id_componente', null, {
        shouldDirty: true,
      })

      setValue('id_grado', null, {
        shouldDirty: true,
      })

      unregister('id_categoria', {
        keepDefaultValue: true,
        keepDirty: true,
      })
      unregister('id_componente', {
        keepDefaultValue: true,
        keepDirty: true,
      })
      unregister('id_grado', { keepDefaultValue: true, keepDirty: true })
    }
  }, [isMilitar, unregister, setValue])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createPersonnel(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Error',
              description: data.error,
              variant: 'destructive',
            })
          }
          if (data?.success) {
            toast({
              title: 'Personal creado',
              description: 'El Personal se ha creado correctamente',
              variant: 'success',
            })

            router.replace('/dashboard/recursos-humanos/personal')
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
      updatePersonnel(dirtyValues, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Personal actualizado',
            description: 'El Personal se ha actualizado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/recursos-humanos/personal')
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
                  required: 'Este campo es requerido',
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-1 items-center gap-4 justify-between">
                    <FormLabel className="mb-3">
                      Tipo de documento de identidad
                    </FormLabel>
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
                disabled={!watch('tipo_cedula')}
                rules={{
                  required: 'Este campo es requerido',
                  validate: (value) => {
                    const documentType = watch('tipo_cedula')
                    if (
                      documentType === 'V' ||
                      documentType === 'E' ||
                      documentType === 'J'
                    ) {
                      return (
                        /^\d{7,10}$/.test(value) ||
                        'Debe ser un número de 7 a 10 dígitos'
                      )
                    }
                    if (documentType === 'P') {
                      return (
                        /^[a-zA-Z0-9]{5,15}$/.test(value) ||
                        'Debe tener entre 5 y 15 caracteres alfanuméricos'
                      )
                    }
                    return true
                  },
                }}
                render={({ field }) => (
                  <FormItem className=" flex flex-1 items-center justify-between gap-4">
                    <FormLabel className="mb-3">{`Documento de identidad`}</FormLabel>

                    <div className="w-[70%]">
                      <FormControl>
                        <Input
                          type="text"
                          onInput={(e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^0-9]/g, '')
                          }}
                          {...field}
                          onBlur={async () => {
                            const exists = await checkIfPersonnelExists(
                              field.value
                            )

                            if (exists) {
                              toast({
                                title: 'El Personal ya existe',
                                action: (
                                  <Link
                                    className={cn(
                                      buttonVariants({ variant: 'secondary' })
                                    )}
                                    href={`/dashboard/recursos-humanos/personal/${exists.id}`}
                                  >
                                    Ver datos del personal
                                  </Link>
                                ),
                                variant: 'destructive',
                              })
                            }
                          }}
                        />
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
              name="cedula_usuario"
              render={({ field }) => (
                <FormItem className="flex flex-1 justify-between gap-4 items-center">
                  <FormLabel>
                    Seleccione la cuenta del usuario si existe:
                  </FormLabel>
                  <div className="w-[70%]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? users.find((user) => user.value === field.value)
                                  ?.label
                              : 'Seleccionar usuario'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar usuario..."
                            className="h-9"
                          />
                          <ScrollArea className="max-h-56">
                            <CommandEmpty>
                              No se encontaron resultados.
                            </CommandEmpty>
                            <CommandGroup>
                              {isUsersLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                users.map((user) => (
                                  <CommandItem
                                    value={user.label}
                                    key={user.value}
                                    onSelect={() => {
                                      setValue('cedula_usuario', user.value, {
                                        shouldDirty: true,
                                      })
                                    }}
                                  >
                                    {user.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        user.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
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
                        <Input
                          type="text"
                          {...field}
                          onInput={(e) =>
                            (e.currentTarget.value =
                              e.currentTarget.value.replace(
                                /[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/g,
                                ''
                              ))
                          }
                        />
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
                        <Input
                          type="text"
                          {...field}
                          onInput={(e) =>
                            (e.currentTarget.value =
                              e.currentTarget.value.replace(
                                /[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/g,
                                ''
                              ))
                          }
                        />
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

            <FormField
              control={control}
              name="tipo"
              rules={{ required: 'Este campo es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de personal</FormLabel>
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
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Militar">Militar</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {isMilitar === 'Militar' ? <FormMilitar /> : null}

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
