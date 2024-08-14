'use client'
import { Input } from '@/modules/common/components/input/input'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { Card, CardContent } from '@/modules/common/components/card/card'
import { SelectedItemCardHeader } from '../../selected-item-card-header'
import { useItemCardContext } from '@/lib/context/selected-item-card-context'

export const CardItemOrder = ({}: {}) => {
  const { control } = useFormContext()
  const { itemData, isError, index } = useItemCardContext()
  return (
    <Card
      key={itemData.id}
      className={`flex flex-col gap-4 ${isError ? 'border-red-400' : ''}`}
    >
      <SelectedItemCardHeader />
      <CardContent className="flex flex-1 flex-col justify-end">
        <FormField
          control={control}
          name={`renglones.${index}.cantidad`}
          rules={{
            required: 'La cantidad es requerida',
            min: {
              value: 1,
              message: 'La cantidad debe ser mayor a 0',
            },
            max: {
              value: (itemData.stock_maximo || 999) - itemData.stock_actual,
              message: 'La cantidad no puede ser mayor al stock maximo',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-1 items-center justify-between gap-2">
              <FormLabel className="w-[12rem]">Cantidad:</FormLabel>

              <div className="w-full flex-1">
                <FormControl>
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) => {
                        field.onChange(parseInt(event.target.value))
                      }}
                    />
                    <p className="text-sm text-foreground">
                      {`${
                        itemData.unidad_empaque?.nombre
                          ? itemData.unidad_empaque?.nombre + '(s)'
                          : 'Unidades'
                      }`}
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`renglones.${index}.observacion`}
          rules={{
            maxLength: {
              value: 125,
              message: 'La observación no puede superar los 125 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col gap-2">
              <FormLabel className="w-[12rem]">{`Observación (opcional):`}</FormLabel>

              <div className="w-full flex-1">
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  {`La observación no puede superar los 125 caracteres`}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormDescription className={`${isError ? 'text-red-500' : ''}`}>
          {isError}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
