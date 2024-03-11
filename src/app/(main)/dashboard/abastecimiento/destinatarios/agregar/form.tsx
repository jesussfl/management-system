'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
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
import { PhoneInput } from '@/modules/common/components/phone-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
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
import { CheckIcon } from 'lucide-react'
import {
  getAllCategories,
  getAllComponents,
  getAllGrades,
} from '@/lib/actions/ranks'
import { createReceiver } from '@/lib/actions/receivers'
import { useRouter } from 'next/navigation'

type FormValues = Omit<DestinatarioType, 'id'>
interface Props {
  defaultValues?: FormValues
  close?: () => void
}
type ComboboxData = {
  value: number
  label: string
}

export default function ReceiversForm({ defaultValues, close }: Props) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [categories, setCategories] = React.useState<ComboboxData[]>([])
  const [components, setComponents] = React.useState<ComboboxData[]>([])
  const [grades, setGrades] = React.useState<ComboboxData[]>([])

  const form = useForm<FormValues>({
    defaultValues,
  })
  const router = useRouter()

  React.useEffect(() => {
    startTransition(() => {
      getAllCategories().then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))
        setCategories(transformedData)
      })

      getAllComponents().then((data) => {
        const transformedData = data.map((component) => ({
          value: component.id,
          label: component.nombre,
        }))

        setComponents(transformedData)
      })

      getAllGrades().then((data) => {
        const transformedData = data.map((grade) => ({
          value: grade.id,
          label: grade.nombre,
        }))

        setGrades(transformedData)
      })
    })
  }, [])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (defaultValues) {
      React.startTransition(() => {
        // updateCategory(defaultValues.id, values).then((data) => {
        //   if (data?.success) {
        //     toast({
        //       title: 'Categoria actualizada',
        //       description: 'La categoria se ha actualizado correctamente',
        //       variant: 'success',
        //     })
        //     close && close()
        //   }
        // })
      })
    } else {
      React.startTransition(() => {
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
      })
    }
  }

  if (isPending) {
    return <div>Cargando...</div>
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
                        placeholder="Ingresa tu numero telefónico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="border-b border-base-300" />

            <div className="flex gap-12">
              {/* <FormField
                control={form.control}
                name="id_unidad"
                render={({ field }) => (
                  <FormItem className="flex flex-1 justify-between gap-4 items-center">
                    <FormLabel>Unidad</FormLabel>
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
                                ? unidades.find(
                                    (unidad) => unidad.value === field.value
                                  )?.label
                                : 'Seleccionar unidad'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="PopoverContent">
                          <Command>
                            <CommandInput
                              placeholder="Buscar unidad..."
                              className="h-9"
                            />
                            <CommandEmpty>
                              No se encontaron resultados.
                            </CommandEmpty>
                            <CommandGroup>
                              {unidades.map((unidad) => (
                                <CommandItem
                                  value={unidad.label}
                                  key={unidad.value}
                                  onSelect={() => {
                                    form.setValue('id_unidad', unidad.value)
                                  }}
                                >
                                  {unidad.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      unidad.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="id_categoria"
                render={({ field }) => (
                  <FormItem className="flex flex-1 justify-between gap-4 items-center">
                    <FormLabel>Categoria:</FormLabel>
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
                                ? categories.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : 'Seleccionar categoría'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="PopoverContent">
                          <Command>
                            <CommandInput
                              placeholder="Buscar categoría..."
                              className="h-9"
                            />
                            <CommandEmpty>
                              No se encontaron resultados.
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue(
                                      'id_categoria',
                                      category.value
                                    )
                                  }}
                                >
                                  {category.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      category.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-12">
              <FormField
                control={form.control}
                name="id_grado"
                render={({ field }) => (
                  <FormItem className="flex flex-1 justify-between gap-4 items-center">
                    <FormLabel>Grado:</FormLabel>
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
                                ? grades.find(
                                    (grade) => grade.value === field.value
                                  )?.label
                                : 'Seleccionar grado'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="PopoverContent">
                          <Command>
                            <CommandInput
                              placeholder="Buscar grado..."
                              className="h-9"
                            />
                            <CommandEmpty>
                              No se encontaron resultados.
                            </CommandEmpty>
                            <CommandGroup>
                              {grades.map((grade) => (
                                <CommandItem
                                  value={grade.label}
                                  key={grade.value}
                                  onSelect={() => {
                                    form.setValue('id_grado', grade.value)
                                  }}
                                >
                                  {grade.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      grade.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_componente"
                render={({ field }) => (
                  <FormItem className="flex flex-1 justify-between gap-4 items-center">
                    <FormLabel>Componente:</FormLabel>
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
                                ? components.find(
                                    (component) =>
                                      component.value === field.value
                                  )?.label
                                : 'Seleccionar componente'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="PopoverContent">
                          <Command>
                            <CommandInput
                              placeholder="Buscar componente..."
                              className="h-9"
                            />
                            <CommandEmpty>
                              No se encontaron resultados.
                            </CommandEmpty>
                            <CommandGroup>
                              {components.map((component) => (
                                <CommandItem
                                  value={component.label}
                                  key={component.value}
                                  onSelect={() => {
                                    form.setValue(
                                      'id_componente',
                                      component.value
                                    )
                                  }}
                                >
                                  {component.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      component.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
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
