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
}
export const ReceptionPeopleFields = ({ receivers, professionals }: Props) => {
  const form = useFormContext()
  return (
    <>
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="cedula_destinatario"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field }) => (
            <FormItem className="flex flex-col flex-1 ">
              <FormLabel>Persona que entrega:</FormLabel>
              <Combobox
                name={field.name}
                form={form}
                field={field}
                data={receivers}
                isValueString
              />

              <FormDescription>
                <Link
                  href="/dashboard/abastecimiento/destinatarios/agregar"
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'text-sm h-[30px]'
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Destinatario
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
            <FormItem className=" flex flex-col flex-1">
              <FormLabel>Profesional que recibe:</FormLabel>
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
                    'text-sm h-[30px]'
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
          name="cedula_autorizador"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field }) => (
            <FormItem className="flex flex-col flex-1">
              <FormLabel>Profesional que autorizará la recepción:</FormLabel>
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
          name="cedula_supervisor"
          render={({ field }) => (
            <FormItem className="flex flex-col flex-1">
              <FormLabel>
                Profesional que supervisa la recepción (opcional):
              </FormLabel>

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
