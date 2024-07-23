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
  getAllRoles,
  getRolesByLevel,
} from '@/app/(main)/dashboard/usuarios/lib/actions/roles'

import { ComboboxData } from '@/types/types'
import { useRouter } from 'next/navigation'
import { Niveles_Usuarios, Usuario } from '@prisma/client'
import { updateUser } from '../../lib/actions/users'
import { Combobox } from '@/modules/common/components/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'

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
  const level = form.watch('nivel')
  const { isDirty, dirtyFields } = useFormState({ control: form.control })

  React.useEffect(() => {
    if (!level) {
      return
    }
    getRolesByLevel(level).then((rol) => {
      const formattedRoles = rol.map((rol) => ({
        value: rol.id,
        label: rol.rol,
      }))

      form.resetField('rol')
      setRoles(formattedRoles)
    })
  }, [form, level])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log('values', values)
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
        className="flex-1 overflow-y-auto px-24 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="nivel"
          rules={{
            required: 'Tipo de documento es requerido',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccione el nivel de usuario para el rol:</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Jefe_de_departamento">
                    Jefe de departamento
                  </SelectItem>
                  <SelectItem value="Encargado">Encargado</SelectItem>
                  <SelectItem value="Personal_civil">Personal Civil</SelectItem>
                  <SelectItem value="Personal_militar">
                    Personal Militar
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch('nivel') && (
          <FormField
            control={form.control}
            name="rol"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Rol:</FormLabel>
                <Combobox
                  name={field.name}
                  data={roles}
                  form={form}
                  field={field}
                />

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
          <Button className="w-[200px]" variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
