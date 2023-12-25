'use client'
import * as React from 'react'
import { Input } from '@/modules/common/components/input/input'
import { Combobox } from '@/modules/common/components/combobox'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { Renglon } from '@/utils/types/types'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
const classifications = [
  {
    value: 'Consumible',
    label: 'Consumible',
  },
  {
    value: 'Equipo',
    label: 'Equipo',
  },
]

interface Props {
  id?: number
  defaultValues?: Renglon
}
const createRenglon = async (data: Renglon) => {
  const response = await fetch('http://localhost:3000/api/renglon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    console.log('success')
  }
}
const editRenglon = async (data: Renglon, id: number) => {
  const response = await fetch(`http://localhost:3000/api/renglon/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.ok) {
    console.log('success')
  }
}
export default function RenglonesForm({ id, defaultValues }: Props) {
  const form = useForm({
    defaultValues: {
      name: defaultValues?.nombre || '',
      description: defaultValues?.descripcion || '',
      classification: defaultValues?.clasificacion || '',
      category: defaultValues?.categoria || '',
      type: defaultValues?.tipo || '',
      presentation: defaultValues?.presentacion || '',
      modelNumber: defaultValues?.numero_parte || '',
      measureUnit: defaultValues?.unidad_de_medida || '',
    },
  })

  const onSubmit: SubmitHandler<Renglon> = async (data) => {
    if (!id) {
      await createRenglon(data)
      return
    } else {
      await editRenglon(data, id)
      return
    }
  }

  return (
    <Form {...form}>
      <form
        className='className="flex-1 overflow-y-auto px-6 py-6"'
        onSubmit={form.handleSubmit(onSubmit as any)}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="name"
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
                  <FormItem className="sm:col-span-4">
                    <FormLabel>Nombre del Renglón</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa el nombre del renglón"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribe el nombre del renglón.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="description"
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
                    <FormItem className="sm:col-span-4">
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
              </div>
            </div>
          </div>

          <div className=" pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="classification"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Clasificación</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Categoría</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-4">
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa el tipo" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <FormField
                  control={form.control}
                  name="modelNumber"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-4">
                      <FormLabel>Número de Parte o Modelo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Numero de parte o modelo"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="presentation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Presentación</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="measureUnit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-4">
                      <FormLabel>Unidad de Medida</FormLabel>
                      <Combobox
                        name={field.name}
                        data={classifications}
                        form={form}
                        field={field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t border-border">
            <Button variant="outline">Cancelar</Button>

            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
