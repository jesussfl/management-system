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

export const Step1 = () => {
  const form = useFormContext()
  return (
    <div className="flex flex-col gap-3 mb-16">
      <FormInstructions>
        <FormInstructionsTitle>
          Añade un nombre y descripción al renglón
        </FormInstructionsTitle>
        <FormInstructionsDescription>
          Ingresa un nombre descriptivo y una breve explicación para identificar
          este renglón en el abastecimiento
        </FormInstructionsDescription>
      </FormInstructions>

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
            value: 100,
            message: 'Debe tener un maximo de 100 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Renglón</FormLabel>
            <FormControl>
              <Input
                placeholder="Ej: Aceite de Motor 5W-30, Martillo de Carpintero, Lápices HB"
                {...field}
              />
            </FormControl>
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
            value: 300,
            message: 'Debe tener un máximo de 300 carácteres',
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <textarea
                id="description"
                placeholder="Detalles específicos del renglón (por ejemplo, características, material, estado)"
                rows={3}
                className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta descripción ayudará a entender rápidamente este tipo de
              elemento dentro del inventario
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
