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
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'
import useGetWeight from '../../../../../../../modules/inventario/hooks/useGetWeight'

export const Step3 = () => {
  const form = useFormContext()
  const { weight } = useGetWeight()

  return (
    <div className="flex flex-col gap-8 mb-8">
      <FormInstructions>
        <FormInstructionsTitle>
          Solo faltan algunos detalles adicionales
        </FormInstructionsTitle>
        <FormInstructionsDescription>
          Añade detalles específicos adicionales para enriquecer la información
          y mejorar la experiencia en la gestión del inventario
        </FormInstructionsDescription>
      </FormInstructions>
      <FormField
        control={form.control}
        name="numero_parte"
        render={({ field }) => (
          <FormItem className="w-full">
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
      <div className="flex flex-1 gap-4">
        <FormField
          control={form.control}
          name="stock_minimo"
          rules={{
            required: true,
            min: 0,
            max: 1000000,
            validate: (value) => {
              if (form.getValues('stock_maximo')) {
                if (value > form.getValues('stock_maximo')) {
                  return 'El stock minimo no puede ser mayor al stock maximo'
                }
                return true
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormItem className="w-full">
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
            validate: (value) => {
              if (form.getValues('stock_minimo')) {
                if (value < form.getValues('stock_minimo')) {
                  return 'El stock maximo no puede ser menor al stock minimo'
                }
                return true
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormItem className="w-full">
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
      </div>
      {
        <FormField
          control={form.control}
          name="peso"
          rules={{
            required: false,
          }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Peso</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingresa el peso del renglón"
                  {...field}
                  onChange={(event) => {
                    if (form.formState.errors[field.name]) {
                      form.clearErrors(field.name)
                    }
                    form.setValue(field.name, Number(event.target.value), {
                      shouldDirty: true,
                    })
                  }}
                  value={weight || field.value || 0}
                  disabled={weight > 0 ? true : false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    </div>
  )
}
