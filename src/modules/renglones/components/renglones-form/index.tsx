'use client'
import * as React from 'react'
import { Input } from '@/modules/common/components/input/input'
import { Combobox } from '@/modules/common/components/combobox'
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
import { Renglones, Clasificacion, UnidadEmpaque } from '@prisma/client'
import { createRenglon, updateRenglon } from '@/lib/actions/create-renglon'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { useRouter } from 'next/navigation'
import { useModal } from '@/lib/store/zustand'
type ClasificacionCombobox = {
  value: Clasificacion
  label: string
}
type UnidadEmpaqueCombobox = {
  value: UnidadEmpaque
  label: string
}

const Clasificaciones: ClasificacionCombobox[] = [
  {
    value: 'ALIMENTOS',
    label: 'Alimentos',
  },
  {
    value: 'ARTICULOS_OFICINA',
    label: 'Articulos de Oficina',
  },
  {
    value: 'EQUIPAMIENTO_MILITAR',
    label: 'Equipamiento Militar',
  },
  {
    value: 'LIQUIDOS',
    label: 'Liquidos',
  },
  {
    value: 'MATERIALES_CONSTRUCCION',
    label: 'Materiales de Construcción',
  },
  {
    value: 'REPUESTOS',
    label: 'Repuestos',
  },
  {
    value: 'OTRO',
    label: 'Otro',
  },
]

const Unidades_Empaque: UnidadEmpaqueCombobox[] = [
  {
    value: 'BARRIL',
    label: 'Barril',
  },
  {
    value: 'BIDON',
    label: 'Bidón',
  },
]

interface Props {
  defaultValues?: Renglones
}
type FormValues = Omit<Renglones, 'id'>

export default function RenglonesForm({ defaultValues }: Props) {
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { toast } = useToast()
  const router = useRouter()
  const { toggleModal } = useModal()
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (defaultValues) {
      updateRenglon(defaultValues.id, data).then(() => {
        toast({
          title: 'Renglon actualizado',
          description: 'El renglon se ha actualizado correctamente',
          variant: 'default',
        })
        toggleModal()
      })
    } else {
      createRenglon(data).then(() => {
        toast({
          title: 'Renglon creado',
          description: 'El renglon se ha creado correctamente',
          variant: 'default',
        })
        router.replace('/dashboard/abastecimiento/inventario')
      })
    }
  }

  return (
    <Form {...form}>
      <form
        className='className="flex-1 overflow-y-auto px-6 py-6"'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="nombre"
          rules={{
            required: true,
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 70,
              message: 'Debe tener un maximo de 70 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Nombre del Renglón</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el nombre del renglón" {...field} />
              </FormControl>
              <FormDescription>Escribe el nombre del renglón.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descripcion"
          rules={{
            required: true,
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 30,
              message: 'Debe tener un maximo de 30 caracteres',
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
                Escribe un poco como es el renglon.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clasificacion"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Clasificación</FormLabel>
              <Combobox
                name={field.name}
                data={Clasificaciones}
                form={form}
                field={field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel>Categoría</FormLabel>
              <Combobox
                name={field.name}
                data={Clasificaciones}
                form={form}
                field={field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa el tipo"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero_parte"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Número de Parte o Modelo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Numero de parte o modelo"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unidad_empaque"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Unidad de Empaque</FormLabel>
              <Combobox
                name={field.name}
                data={Unidades_Empaque}
                form={form}
                field={field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock_minimo"
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Mínimo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa el stock mínimo"
                  {...field}
                  onChange={(event) => {
                    field.onChange(parseInt(event.target.value))
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock_maximo"
          rules={{
            required: false,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Máximo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingresa el stock máximo"
                  {...field}
                  onChange={(event) => {
                    field.onChange(parseInt(event.target.value))
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t border-border">
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
