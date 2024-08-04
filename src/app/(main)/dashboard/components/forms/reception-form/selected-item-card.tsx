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
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { Switch } from '@/modules/common/components/switch/switch'
import { ReceptionFieldsByQuantity } from './card-quantity-fields'
import { SelectedItemCardHeader } from '../../selected-item-card-header'
import { useSelectedItemCardContext } from './context/card-context'
import { SerialSelector, SerialSelectorTrigger } from './serial-selector'

export const SelectedItemCard = ({ isLiquid }: { isLiquid: boolean }) => {
  const { itemData, isEditing, index, isError } = useSelectedItemCardContext()
  const { watch, control, resetField } = useFormContext()

  const isFillingEnabled: boolean = watch(
    `renglones.${index}.is_filling_enabled`
  )
  // console.log(watch(`renglones.${index}`))
  return (
    <Card className={`flex flex-col gap-4 ${isError ? 'border-red-400' : ''}`}>
      <SelectedItemCardHeader />

      <CardContent className="flex flex-col flex-1 justify-end">
        {isLiquid && (
          <FormField
            control={control}
            name={`renglones.${index}.is_filling_enabled`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    Llenado de {itemData.unidad_empaque.tipo_medida}
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground w-[80%]">
                    Esta opcion te permitirá cargar la cantidad en{' '}
                    {itemData.unidad_empaque.tipo_medida} que deseas llenar del
                    stock existente
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      resetField(`renglones.${index}`)
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
