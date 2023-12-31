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

export const Step3 = () => {
  const form = useFormContext()

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
    </div>
  )
}
