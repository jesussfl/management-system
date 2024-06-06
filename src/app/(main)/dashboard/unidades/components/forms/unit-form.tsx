'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
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
import { Input } from '@/modules/common/components/input/input'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import { ComboboxData, UnidadesType } from '@/types/types'
import { getAllZodis } from '../../lib/actions/zodis'
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
import { createUnit, updateUnit } from '../../lib/actions/units'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import Link from 'next/link'
type FormValues = Omit<UnidadesType, 'id'>

export default function UnitsForm({
  defaultValues,
}: {
  defaultValues?: UnidadesType
}) {
  const isEditEnabled = !!defaultValues

  //Toast
  const { toast } = useToast()
  const router = useRouter()

  //Form
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  //States
  const [isPending, startTransition] = React.useTransition()
  const [zodis, setZodis] = React.useState<ComboboxData[]>([])
  const [isZodisLoading, setIsZodisLoading] = React.useState(false)
  React.useEffect(() => {
    setIsZodisLoading(true)

    // Get components data and transform it to CheckboxType
    getAllZodis().then((data) => {
      const transformedData = data.map((zodi) => ({
        value: zodi.id,
        label: zodi.nombre,
      }))

      setZodis(transformedData)
    })

    setIsZodisLoading(false)
  }, [])
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createUnit(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Error',
              description: data.error,
              variant: 'destructive',
            })

            return
          }
          if (data?.success) {
            toast({
              title: 'Unidad creada',
              description: 'La Unidad se ha creado correctamente',
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

      updateUnit(defaultValues.id, dirtyValues).then((data) => {
        if (data?.error) {
          toast({
            title: 'Error',
            description: data.error,
            variant: 'destructive',
          })
        }
        if (data?.success) {
          toast({
            title: 'Unidad actualizada',
            description: 'La unidad se ha actualizado correctamente',
            variant: 'success',
          })
          router.back()
        }
      })
    })
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
                      form.setValue(field.name, e.target.value, {
                        shouldDirty: true,
                      })
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="descripcion"
              rules={{
                required: 'Este campo es necesario',
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
                        form.setValue(field.name, e.target.value, {
                          shouldDirty: true,
                        })
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`ubicacion`}
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Ubicacion</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        if (form.formState.errors[field.name]) {
                          form.clearErrors(field.name)
                        }
                        form.setValue(field.name, e.target.value, {
                          shouldDirty: true,
                        })
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`id_zodi`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zodis</FormLabel>
                <FormControl>
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
                            ? zodis.find((zodi) => zodi.value === field.value)
                                ?.label
                            : 'Seleccionar zodi...'}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="PopoverContent">
                      <Command>
                        <CommandInput
                          placeholder="Buscar zodi..."
                          className="h-9"
                        />
                        <CommandEmpty>
                          No se encontaron resultados.
                        </CommandEmpty>
                        <CommandGroup>
                          {isZodisLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            zodis.map((zodi) => (
                              <CommandItem
                                value={zodi.label}
                                key={zodi.value}
                                onSelect={() => {
                                  form.setValue('id_zodi', zodi.value, {
                                    shouldDirty: true,
                                  })
                                }}
                              >
                                {zodi.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    zodi.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  <Link
                    href="/dashboard/unidades/zodi"
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'text-sm h-[30px]'
                    )}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Zodi
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button disabled={isPending} variant="default" type="submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
