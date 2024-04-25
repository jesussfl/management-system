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
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
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
import { CheckIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  createRol,
  getAllRoles,
  updateRol,
} from '@/app/(main)/dashboard/usuarios/lib/actions/roles'

import { ComboboxData } from '@/types/types'
import { useRouter } from 'next/navigation'
import { Prisma, Usuario } from '@prisma/client'
import { Combobox } from '@/modules/common/components/combobox'
import { updateUser } from '../../lib/actions/users'

// type User = Prisma.UsuarioGetPayload<{ include: { rol: true } }>
type FormValues = Omit<Usuario, 'id'> & { rol: number }
interface Props {
  defaultValues?: Usuario & {
    rol: number
  }
}

export default function UsersForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const [roles, setRoles] = React.useState<ComboboxData[]>([])

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })

  React.useEffect(() => {
    getAllRoles().then((rol) => {
      const formattedRoles = rol.map((rol) => ({
        value: rol.id,
        label: rol.rol,
      }))

      setRoles(formattedRoles)
    })
  }, [form])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!isEditEnabled) {
      // createRol(formattedValues).then((data) => {
      //   if (data?.error) {
      //     form.setError(data.field as any, {
      //       type: 'custom',
      //       message: data.error,
      //     })
      //   }

      //   if (data?.success) {
      //     toast({
      //       title: 'Rol creado',
      //       description: 'El rol se ha creado correctamente',
      //       variant: 'success',
      //     })

      //     router.back()
      //   }
      // })

      return
    }

    if (!isDirty) {
      toast({
        title: 'No se han detectado cambios',
      })
      return
    }

    // const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues

    updateUser(defaultValues.id, values).then((data) => {
      if (data?.success) {
        toast({
          title: 'Usuario actualizado',
          description: 'El usuario se ha actualizado correctamente',
          variant: 'success',
        })

        router.back()
      }
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto px-8 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem className="flex flex-1 justify-between gap-4 items-center">
              <FormLabel>Rol:</FormLabel>
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
                          ? roles.find((roles) => roles.value === field.value)
                              ?.label
                          : 'Seleccionar rol'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="PopoverContent">
                    <Command>
                      <CommandInput
                        placeholder="Buscar rol..."
                        className="h-9"
                      />
                      <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                      <CommandGroup>
                        {!roles ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          roles.map((component) => (
                            <CommandItem
                              value={component.label}
                              key={component.value}
                              onSelect={() => {
                                form.setValue('rol', component.value, {
                                  shouldDirty: true,
                                })
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
                          ))
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
