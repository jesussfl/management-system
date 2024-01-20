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
import { Renglones, Clasificacion, UnidadEmpaque } from '@prisma/client'

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
export const Step2 = () => {
  const form = useFormContext()

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
      <div className="flex justify-between gap-8">
        <FormField
          control={form.control}
          name="clasificacion"
          rules={{
            required: 'Este campo es requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full ">
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
          rules={{
            required: 'Este campo es requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full ">
              <FormLabel>Categoría</FormLabel>
              <Combobox
                name={field.name}
                data={Clasificaciones}
                form={form}
                field={field}
                disabled={form.watch('clasificacion') === undefined}
              />
              <FormDescription>
                {form.watch('clasificacion') === undefined
                  ? 'Elige una clasificacion primero'
                  : ''}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-between gap-8">
        <FormField
          control={form.control}
          name="unidad_empaque"
          rules={{
            required: 'Este campo es requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-2.5">
              <FormLabel>Unidad de Empaque</FormLabel>
              <Combobox
                name={field.name}
                data={Unidades_Empaque}
                form={form}
                field={field}
                disabled={form.watch('clasificacion') === undefined}
              />
              <FormDescription>
                {form.watch('clasificacion') === undefined
                  ? 'Elige una clasificacion primero'
                  : ''}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
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
    </div>
  )
}
