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

import { Loader2 } from 'lucide-react'

import useItemCreationData from '@/lib/hooks/useItemCreationData'
import { Switch } from '@/modules/common/components/switch/switch'
import { useState } from 'react'

export const Step2 = () => {
  const form = useFormContext()
  const { categories, classifications, packagingUnits } = useItemCreationData()
  const [hasPackagingUnit, setHasPackagingUnit] = useState(false)

  return (
    <div className="mb-8 flex flex-col gap-5">
      <FormInstructions>
        <FormInstructionsTitle>
          Mejora la búsqueda del renglón
        </FormInstructionsTitle>
        <FormInstructionsDescription>
          Completa la siguiente información para segmentar el renglón
          correctamente
        </FormInstructionsDescription>
      </FormInstructions>

      <FormField
        control={form.control}
        name="clasificacionId"
        rules={{
          required: 'Este campo es requerido',
        }}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col">
            <FormLabel>Clasificación</FormLabel>
            <Combobox
              name={field.name}
              data={classifications.data}
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
            if (categories.isLoading)
              return <Loader2 className="h-6 w-6 animate-spin" />

            return (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Categoría</FormLabel>

                <Combobox
                  name={field.name}
                  data={categories.data}
                  form={form}
                  field={field}
                  disabled={form.watch('clasificacionId') === undefined}
                />

                <FormMessage />
              </FormItem>
            )
          }}
        />
      )}
      <div className="flex flex-col gap-2">
        <FormLabel>
          ¿Este renglón se recibe en alguna unidad de empaque?
        </FormLabel>
        <div className="flex items-center gap-4">
          <FormDescription>No. Se recibe en unidades</FormDescription>
          <Switch
            checked={hasPackagingUnit}
            onCheckedChange={(value) => {
              if (value) {
                setHasPackagingUnit(true)
              } else {
                setHasPackagingUnit(false)
                form.setValue('unidadEmpaqueId', null, { shouldDirty: true })
                form.setValue('peso', 0, { shouldDirty: true })
                form.setValue('tipo_medida_unidad', null, { shouldDirty: true })
              }
            }}
          />
          <FormDescription>Si. Se recibe en empaque</FormDescription>
        </div>
      </div>
      {hasPackagingUnit && (
        <FormField
          control={form.control}
          name="unidadEmpaqueId"
          rules={{
            required: 'Este campo es requerido',
          }}
          render={({ field }) => {
            if (packagingUnits.isLoading)
              return <Loader2 className="h-6 w-6 animate-spin" />
            return (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Seleccione la unidad de empaque</FormLabel>
                <Combobox
                  name={field.name}
                  data={packagingUnits.data}
                  form={form}
                  field={field}
                />

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
            <FormDescription>
              El tipo sirve para asignar un nivel más de segmentación para el
              renglón (Ej. Un tipo de aceite).
            </FormDescription>
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
    </div>
  )
}
