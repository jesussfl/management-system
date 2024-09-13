'use client'
import { buttonVariants } from '@/modules/common/components/button'
import { Combobox } from '@/modules/common/components/combobox'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { cn } from '@/utils/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
type ComboboxData = {
  value: string
  label: string
}
interface Props {
  receivers: ComboboxData[]
  professionals: ComboboxData[]
  config: {
    destinatario_label: string
    abastecedor_label: string
    servicio: 'Abastecimiento' | 'Armamento'
  }
}
export const FormPeopleFields = ({
  receivers,
  professionals,
  config,
}: Props) => {
  const form = useFormContext()
  return (
    <>
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="cedula_destinatario"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel>{config.destinatario_label}</FormLabel>
              <Combobox
                name={field.name}
                form={form}
                field={field}
                data={receivers}
                isValueString
              />

              <FormDescription>
                <Link
                  href={`/dashboard/${config.servicio.toLowerCase()}/destinatarios/agregar`}
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'h-[30px] text-sm'
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Nuevo
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cedula_abastecedor"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel>{config.abastecedor_label}</FormLabel>
              <Combobox
                name={field.name}
                form={form}
                field={field}
                data={professionals}
                isValueString
              />

              <FormDescription>
                <Link
                  href="/dashboard/profesionales/agregar"
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'h-[30px] text-sm'
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Profesional
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="cedula_supervisor"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel>Profesional que supervisa:</FormLabel>

              <Combobox
                name={field.name}
                form={form}
                field={field}
                data={professionals}
                isValueString
              />

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cedula_autorizador"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel>Profesional que autoriza:</FormLabel>
              <Combobox
                name={field.name}
                form={form}
                field={field}
                data={professionals}
                isValueString
              />

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
