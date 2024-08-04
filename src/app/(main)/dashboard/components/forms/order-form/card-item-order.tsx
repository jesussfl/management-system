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
import { Prisma } from '@prisma/client'
import { SelectedItemCardHeader } from '../../selected-item-card-header'

type RenglonType = Prisma.RenglonGetPayload<{
  include: { unidad_empaque: true; recepciones: true }
}>
export const CardItemOrder = ({
  item,
  index,
  deleteItem,
  isEmpty,
}: {
  item: RenglonType
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
}) => {
  const { control } = useFormContext()

  return (
    <Card
      key={item.id}
      className={`flex flex-col gap-4 ${isEmpty ? 'border-red-400' : ''}`}
    >
      <SelectedItemCardHeader />
      <CardContent className="flex flex-col flex-1 justify-end">
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
              value:
                (item.stock_maximo || 999) -
                item.recepciones.reduce(
                  (total, item) => total + item.cantidad,
                  0
                ),
              message: 'La cantidad no puede ser mayor al stock maximo',
            },
          }}
          render={({ field }) => (
            <FormItem className="items-center flex flex-1 justify-between gap-2">
              <FormLabel className="w-[12rem]">Cantidad:</FormLabel>

              <div className="flex-1 w-full">
                <FormControl>
                  <div className="flex flex-row gap-2 items-center">
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) => {
                        field.onChange(parseInt(event.target.value))
                      }}
                    />
                    <p className="text-foreground text-sm">
                      {`${
                        item.unidad_empaque?.nombre
                          ? item.unidad_empaque?.nombre + '(s)'
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
            <FormItem className="flex flex-col flex-1 gap-2">
              <FormLabel className="w-[12rem]">{`Observación (opcional):`}</FormLabel>

              <div className="flex-1 w-full">
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

        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
