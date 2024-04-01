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
import useItemCreationData from '../../lib/hooks/useItemCreationData'

export const Step2 = () => {
  const form = useFormContext()
  const { categories, classifications, packagingUnits } = useItemCreationData()

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
              return <Loader2 className="w-6 h-6 animate-spin" />

            return (
              <FormItem className="flex flex-col w-full ">
                <FormLabel>Categoría</FormLabel>
                <Combobox
                  name={field.name}
                  data={categories.data}
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
            if (packagingUnits.isLoading)
              return <Loader2 className="w-6 h-6 animate-spin" />
            return (
              <FormItem className="flex flex-col w-full gap-2.5">
                <FormLabel>Unidad de Empaque</FormLabel>
                <Combobox
                  name={field.name}
                  data={packagingUnits.data}
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
    </div>
  )
}
