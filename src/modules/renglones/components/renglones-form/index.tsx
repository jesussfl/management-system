'use client'
import * as React from 'react'
import { Button } from '@/modules/common/components/button/button'
import { Input } from '@/modules/common/components/input/input'
import { Label } from '@/modules/common/components/label/label'
import { ComboboxDemo } from '@/modules/common/components/combobox'
export default function Form() {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Label htmlFor="name">Nombre del Renglón</Label>
              <Input
                type="text"
                id="name"
                placeholder="Ingresa el nombre del renglón"
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="description">Descripción</Label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escribe un poco cómo es el renglón.
              </p>
            </div>
          </div>
        </div>

        <div className=" pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label htmlFor="classification">Clasificación</Label>
              <div className="mt-2">
                <ComboboxDemo />
              </div>
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="category">Categoría</Label>
              <div className="mt-2">
                <ComboboxDemo />
              </div>
            </div>

            <div className="sm:col-span-4">
              <Label htmlFor="type">Tipo</Label>
              <div className="mt-2">
                <Input id="type" name="type" type="text" />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escribe un poco cómo es el renglón.
              </p>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <Label htmlFor="modelNumber">Numero de Parte / Modelo</Label>
              <div className="mt-2">
                <Input type="text" name="modelNumber" id="modelNumber" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="presentation">Presentación</Label>
              <div className="mt-2">
                <ComboboxDemo />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label
                htmlFor="measurementUnit"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Unidad de Medida
              </Label>
              <div className="mt-2">
                <ComboboxDemo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
