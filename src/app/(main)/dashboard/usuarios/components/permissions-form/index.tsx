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
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  createPermission,
  updatePermiso,
} from '@/app/(main)/dashboard/usuarios/lib/actions/permissions'
import { Input } from '@/modules/common/components/input/input'
import { Permiso } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import {
  SECTION_NAMES,
  SIDE_MENU_ITEMS,
} from '@/utils/constants/sidebar-constants'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'

interface Props {
  defaultValues?: Permiso
}

enum Permissions {
  CREAR = 'Crear',
  // LEER = 'Leer',
  ACTUALIZAR = 'Actualizar',
  ELIMINAR = 'Eliminar',
  FULL = 'Full',
}

//extends Permiso

//type FormValues = Omit<Permiso, 'key'>

type FormValues = {
  nombre: string
  descripcion: string
  seccion: SECTION_NAMES
  permiso: Permissions
}

const getAllSectionIdentifiers = () => {
  const identifiers = SIDE_MENU_ITEMS.map((item) => {
    if (item.submenuItems) {
      const subSections = item.submenuItems.map((subItem) => {
        return { subSection: subItem.identifier, mainSection: item.identifier }
      })

      return {
        section: item.identifier,
        subSections,
      }
    }

    return {
      section: item.identifier,
      subSections: null,
    }
  })
  return identifiers
}
const destructureKey = (key: string) => {
  const [seccion, permiso] = key.split(':')
  return {
    seccion: seccion as SECTION_NAMES,
    permiso: permiso as Permissions,
  }
}

//TODO: Improve UX to add multiple permissions at the same time

const formatDefaultValues = (defaultValues?: Permiso) => {
  if (!defaultValues) {
    return {
      seccion: undefined,
      permiso: undefined,
      nombre: '',
      descripcion: '',
    }
  }
  const { seccion, permiso } = destructureKey(defaultValues?.key)
  return {
    ...defaultValues,
    nombre: defaultValues?.permiso,
    seccion,
    permiso,
  }
}

export default function PermissionsForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const form = useForm<FormValues>({
    defaultValues: formatDefaultValues(defaultValues),
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const router = useRouter()
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formattedValues = {
      permiso: values.nombre,
      descripcion: values.descripcion,
      key: `${values.seccion}:${values.permiso}`,
    }
    if (!isEditEnabled) {
      createPermission(formattedValues).then((data) => {
        if (data?.error) {
          form.setError(data.field as any, {
            type: 'custom',
            message: data.error,
          })
        }

        if (data?.success) {
          toast({
            title: 'Permiso creado',
            description: 'El permiso se ha creado correctamente',
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

    updatePermiso(defaultValues.id, formattedValues).then((data) => {
      if (data?.success) {
        toast({
          title: 'Permiso actualizado',
          description: 'El permiso se ha actualizado correctamente',
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
        className="flex-1 overflow-y-auto p-6 pb-20 gap-8"
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
                value: 70,
                message: 'Debe tener un máximo de 70 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Permiso</FormLabel>
                <FormControl>
                  <Input {...field} />
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

          <FormField
            control={form.control}
            name="permiso"
            rules={{ required: 'Este campo es necesario' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permiso</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el permiso que quieres asignar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Permissions).map((permission) => (
                      <SelectItem key={permission} value={permission}>
                        {permission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona la acción que deseas realizar con este permiso.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seccion"
            rules={{ required: 'Este campo es necesario' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sección</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la sección que quieres asignar al permiso" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-60">
                    <ScrollArea className="h-60">
                      {Object.keys(SECTION_NAMES).map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona la sección o subsección que deseas asignar al
                  permiso.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white border-t border-border gap-4 items-center w-full p-4">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
