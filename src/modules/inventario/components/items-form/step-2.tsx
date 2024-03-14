import { useFormContext } from 'react-hook-form'
import {
  FormInstructions,
  FormInstructionsDescription,
  FormInstructionsTitle,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'
import { Combobox } from '@/modules/common/components/combobox'

import { useEffect, useState, useTransition } from 'react'
import { getAllCategories } from '@/lib/actions/categories'
import { getAllClassifications } from '@/lib/actions/classifications'
import { getAllPresentations } from '@/lib/actions/presentations'
import { UnidadEmpaque } from '@prisma/client'
import { Loader2 } from 'lucide-react'

type ComboboxData = {
  value: number
  label: string
}

export const Step2 = () => {
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<ComboboxData[]>([])
  const [classifications, setClassifications] = useState<ComboboxData[]>([])
  const [packagingUnits, setPackagingUnits] = useState<ComboboxData[]>([])
  const [packagingUnitsData, setPackagingUnitsData] = useState<UnidadEmpaque[]>(
    []
  )
  const form = useFormContext()

  useEffect(() => {
    startTransition(() => {
      getAllCategories().then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))

        setCategories(transformedData)
      })

      getAllClassifications().then((data) => {
        const transformedData = data.map((classification) => ({
          value: classification.id,
          label: classification.nombre,
        }))

        setClassifications(transformedData)
      })

      getAllPresentations().then((data) => {
        const transformedData = data.map((presentation) => ({
          value: presentation.id,
          label: presentation.nombre,
        }))
        setPackagingUnitsData(data)
        setPackagingUnits(transformedData)
      })
    })
  }, [])

  return (
    <div className="flex flex-col gap-5 mb-8">
      <FormInstructions>
        <FormInstructionsTitle>
          Mejora la búsqueda del renglón
        </FormInstructionsTitle>
        <FormInstructionsDescription>
          Completa la siguiente información para segmentar el renglón
          correctamente
        </FormInstructionsDescription>
      </FormInstructions>

      {!isPending ? (
        <>
          <FormField
            control={form.control}
            name="clasificacionId"
            rules={{
              required: 'Este campo es requerido',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full ">
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
          {form.watch('clasificacionId') !== undefined && (
            <FormField
              control={form.control}
              name="categoriaId"
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => {
                const filteredCategories = categories.filter((category) =>
                  category.value === form.watch('clasificacionId')
                    ? {
                        value: category.value,
                        label: category.label,
                      }
                    : null
                )
                return (
                  <FormItem className="flex flex-col w-full ">
                    <FormLabel>Categoría</FormLabel>
                    <Combobox
                      name={field.name}
                      data={filteredCategories}
                      form={form}
                      field={field}
                      disabled={form.watch('clasificacionId') === undefined}
                    />
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}
          {form.watch('categoriaId') !== undefined && (
            <FormField
              control={form.control}
              name="unidadEmpaqueId"
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => {
                const filteredPackagingUnits = packagingUnits.filter(
                  (packagingUnit) =>
                    packagingUnit.value === form.watch('categoriaId')
                      ? {
                          value: packagingUnit.value,
                          label: packagingUnit.label,
                        }
                      : null
                )
                return (
                  <FormItem className="flex flex-col w-full gap-2.5">
                    <FormLabel>Unidad de Empaque</FormLabel>
                    <Combobox
                      name={field.name}
                      data={filteredPackagingUnits}
                      form={form}
                      field={field}
                      disabled={form.watch('clasificacionId') === undefined}
                    />
                    <FormDescription></FormDescription>

                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{`Tipo (Opcional)`}</FormLabel>
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
        </>
      ) : (
        <Loader2 className="w-6 h-6 animate-spin" />
      )}
    </div>
  )
}
