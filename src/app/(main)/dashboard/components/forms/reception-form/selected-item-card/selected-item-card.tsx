'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/modules/common/components/form'

import { Card, CardContent } from '@/modules/common/components/card/card'

import { Switch } from '@/modules/common/components/switch/switch'
import { ReceptionFieldsByQuantity } from './card-quantity-fields'
import { SelectedItemCardHeader } from '../../../selected-item-card-header'
import { useSelectedItemCardContext } from '@/lib/context/selected-item-card-context'
import { SerialSelectorTrigger } from './serial-selector'

export const SelectedItemCard = () => {
  const { itemData, isEditing, index, isError } = useSelectedItemCardContext()
  const { watch, control, resetField, setValue } = useFormContext()
  const isPackageForLiquids =
    itemData.unidad_empaque?.tipo_medida === 'LITROS' ||
    itemData.unidad_empaque?.tipo_medida === 'MILILITROS'
  const isFillingEnabled: boolean = watch(
    `renglones.${index}.es_recepcion_liquidos`
  )

  return (
    <Card className={`flex flex-col gap-4 ${isError ? 'border-red-400' : ''}`}>
      <SelectedItemCardHeader />

      <CardContent className="flex flex-col flex-1 justify-start">
        {isPackageForLiquids && (
          <FormField
            control={control}
            name={`renglones.${index}.es_recepcion_liquidos`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    Agregar por {itemData.tipo_medida_unidad.toLowerCase()}
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground w-[80%]">
                    Si marcas esta opción podrás añadir cantidad en{' '}
                    {itemData.tipo_medida_unidad} en vez del stock
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      resetField(`renglones.${index}`)
                      setValue(`renglones.${index}.id_renglon`, itemData.id),
                        field.onChange(value)
                    }}
                    disabled={isEditing}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {isFillingEnabled ? (
          <SerialSelectorTrigger />
        ) : (
          <ReceptionFieldsByQuantity />
        )}

        <FormDescription className={`${isError ? 'text-red-500' : ''}`}>
          {isError}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
