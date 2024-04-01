'use client'
import { Input } from '@/modules/common/components/input/input'

import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { v4 } from 'uuid'
import { Switch } from '@/modules/common/components/switch/switch'
export function SerialsForm({
  index: indexForm,
  quantity,
  id,
}: {
  index: number
  quantity: number
  id?: number
}) {
  const form = useFormContext()
  const autoSerialsEnabled = form.watch(
    `renglones.${indexForm}.seriales_automaticos`
  )

  return (
    <div className="flex flex-col gap-0 p-8 overflow-y-auto">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle>Seriales</CardTitle>
        <CardDescription>Ingresa los seriales de la recepción</CardDescription>
        <FormField
          control={form.control}
          name={`renglones.${indexForm}.seriales_automaticos`}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row justify-center items-center gap-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      if (!value) {
                        Array.from({ length: quantity }).map((_, index) => {
                          form.setValue(
                            `renglones.${indexForm}.seriales.${index}.serial`,
                            ''
                          )
                        })
                      }
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormLabel>Seriales automaticos</FormLabel>
              </FormItem>
            )
          }}
        />
      </CardHeader>
      {Array.from({ length: quantity }).map((_, index) => (
        <FormField
          key={`renglon-${indexForm}-serial-${index}`}
          control={form.control}
          name={`renglones.${indexForm}.seriales.${index}.serial`}
          rules={{ required: true, validate: (value) => !!value || 'Required' }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Serial #{index + 1}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    if (form.formState.errors[field.name]) {
                      form.clearErrors(field.name)
                    }
                    form.setValue(field.name, e.target.value, {
                      shouldDirty: true,
                    })
                  }}
                  value={
                    field.value ||
                    (autoSerialsEnabled
                      ? form.setValue(field.name, v4(), {
                          shouldDirty: true,
                        })
                      : '') ||
                    ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}
