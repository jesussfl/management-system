'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { CardHeader } from '@/modules/common/components/card/card'
import { Switch } from '@/modules/common/components/switch/switch'
import { useEffect, useState, useTransition } from 'react'
import { getSerialsByItem } from '@/lib/actions/serials'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
export function SerialsForm({
  index: indexForm,
  quantity,
  id,
}: {
  index: number
  quantity: number
  id: number
}) {
  const [isPending, startTransition] = useTransition()
  const [serials, setSerials] = useState<string[]>([])
  const form = useFormContext()
  const isEditMode = form.watch(`renglones.${indexForm}.seriales`).length > 0

  console.log(isEditMode)
  useEffect(() => {
    const getSerials = async () => {
      startTransition(() => {
        getSerialsByItem(id).then((serials) => {
          setSerials(serials)
        })
      })
    }

    getSerials()
  }, [id])

  return (
    <div className="flex flex-col gap-0 p-8 overflow-y-auto">
      <CardHeader className="flex items-center justify-between gap-4">
        <FormField
          control={form.control}
          name={`renglones.${indexForm}.seriales`}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row justify-center items-center gap-4">
                <FormControl>
                  <Switch
                    checked={field.value?.length === serials.length}
                    onCheckedChange={(value) => {
                      if (value) {
                        form.setValue(
                          `renglones.${indexForm}.seriales`,
                          serials.map((serial) => {
                            return serial
                          })
                        )

                        return
                      }

                      form.setValue(`renglones.${indexForm}.seriales`, [], {
                        shouldDirty: true,
                      })
                    }}
                  />
                </FormControl>
                <FormLabel>Seleccionar todos los seriales</FormLabel>
              </FormItem>
            )
          }}
        />
      </CardHeader>
      {!isPending && (
        <FormField
          control={form.control}
          name={`renglones.${indexForm}.seriales`}
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Selecciona los seriales a despachar
                </FormLabel>
                {/* <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription> */}
              </div>
              {serials.map((serial) => {
                console.log(serial)
                return (
                  <FormField
                    key={serial}
                    control={form.control}
                    name={`renglones.${indexForm}.seriales`}
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={serial}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(serial)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, serial])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== serial
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {serial}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                )
              })}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
