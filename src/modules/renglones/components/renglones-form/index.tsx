'use client'
import * as React from 'react'
import { Input } from '@/modules/common/components/input/input'
import { Label } from '@/modules/common/components/label/label'
import { Combobox } from '@/modules/common/components/combobox'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/modules/common/components/button/button'
import { X } from 'lucide-react'
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
import { useParams } from 'next/navigation'
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

export default function RenglonesForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      classification: '',
      category: '',
      type: '',
      presentation: '',
      modelNumber: '',
      measureUnit: '',
    },
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<Renglon> = async (data) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)}>
        <div className="flex justify-between items-center border-b border-border pb-6 my-6 gap-x-6">
          <div className="h-8 w-8 cursor-pointer">
            <X onClick={router.back} />
          </div>
          <div className="flex gap-x-4">
            <Button variant="outline" onClick={router.back}>
              Publicar borrador
            </Button>
            <Button type="submit">Publicar renglón</Button>
          </div>
        </div>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

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
        </div>
      </form>
    </Form>
  )
}
