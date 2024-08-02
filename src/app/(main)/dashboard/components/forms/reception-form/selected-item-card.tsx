'use client'
import { useEffect, useState, useTransition } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Eye, MousePointerClickIcon, Plus } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/modules/common/components/form'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import ModalForm from '@/modules/common/components/modal-form'
import { SerialsForm, SerialsFormTrigger } from './serials-form'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { Switch } from '@/modules/common/components/switch/switch'
import { ReceptionFieldsByQuantity } from './card-quantity-fields'
import { getSerialsByItemEnabled } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { receptionSerialColumns } from './serial-columns'
import { SerialWithRenglon } from '@/types/types'
import { NumericFormat } from 'react-number-format'
import { SelectedItemCardHeader } from '../../selected-item-card-header'
import { useSelectedItemCardContext } from './card-context/card-context'

export const SelectedItemCard = ({}: {}) => {
  const { itemData, isEditing, index, isError } = useSelectedItemCardContext()
  const { watch, control } = useFormContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serialsByItemId, setSerialsByItemId] = useState<SerialWithRenglon[]>(
    []
  )
  const [selectedSerials, setSelectedSerials] = useState<SerialWithRenglon[]>(
    []
  )

  const isFillingEnabled: boolean = watch(
    `renglones.${index}.is_filling_enabled`
  )

  useEffect(() => {
    if (isEditing || !isFillingEnabled) return

    startTransition(() => {
      getSerialsByItemEnabled(itemData.id).then((serials) => {
        setSerialsByItemId(serials)
      })
    })
  }, [isEditing, isFillingEnabled, watch, index, itemData.id])

  return (
    <Card className={`flex flex-col gap-4 ${isError ? 'border-red-400' : ''}`}>
      <SelectedItemCardHeader />
      <CardContent className="flex flex-col flex-1 justify-end">
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
                  {itemData.unidad_empaque.tipo_medida} que deseas llenar de
                  seriales existentes
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isEditing}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isFillingEnabled ? null : (
          // <ModalForm
          //   triggerName={`Seleccionar seriales`}
          //   triggerVariant={'default'}
          //   triggerIcon={<MousePointerClickIcon className="h-4 w-4" />}
          //   closeWarning={false}
          //   className="max-h-[80vh]"
          //   disabled={isPending || serialsByItemId.length === 0}
          //   open={isModalOpen}
          //   customToogleModal={toogleModal}
          // >
          //   <div className="p-24">
          //     <DataTable
          //       columns={receptionSerialColumns}
          //       data={serialsByItemId}
          //       isStatusEnabled={false}
          //       onSelectedRowsChange={setSelectedSerials}
          //     />
          //     {selectedSerials.map((serialData) => {
          //       return (
          //         <Card>
          //           <CardHeader>
          //             <CardTitle className="text-md font-medium text-foreground">
          //               {`Serial: ${serialData.serial}`}
          //             </CardTitle>
          //             <CardDescription>{`Peso Actual:  (Max. ${item.peso} ${item.unidad_empaque.abreviacion})`}</CardDescription>
          //           </CardHeader>
          //           <CardContent className="flex flex-col gap-4">
          //             <FormField
          //               control={control}
          //               name={`renglones.${index}.serials.${serialData.id}.peso_restante`}
          //               render={({
          //                 field: { value, onChange, ref, ...rest },
          //               }) => (
          //                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-4">
          //                   <div className="space-y-0.5">
          //                     <FormLabel>Peso</FormLabel>
          //                     <FormDescription className="text-sm text-muted-foreground w-[80%]">
          //                       Ingresar el peso actual del serial
          //                     </FormDescription>
          //                   </div>
          //                   <FormControl>
          //                     <div className="flex items-center gap-2">
          //                       <NumericFormat
          //                         className="w-[100px] rounded-md border-1 border-border p-1.5 text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          //                         allowNegative={false}
          //                         thousandSeparator=""
          //                         decimalSeparator="."
          //                         prefix=""
          //                         decimalScale={2}
          //                         getInputRef={ref}
          //                         value={value}
          //                         onValueChange={({ floatValue }) => {
          //                           onChange(floatValue)
          //                         }}
          //                         {...rest}
          //                       />
          //                       <p className="text-sm text-foreground">
          //                         {item.unidad_empaque.abreviacion}
          //                       </p>
          //                     </div>
          //                   </FormControl>
          //                 </FormItem>
          //               )}
          //             />
          //           </CardContent>
          //         </Card>
          //       )
          //     })}
          //     <Button
          //       className="w-[200px] sticky bottom-8 left-8"
          //       variant={'default'}
          //       onClick={() => setIsModalOpen(false)}
          //     >
          //       Listo
          //     </Button>
          //   </div>
          // </ModalForm>
          <ReceptionFieldsByQuantity />
        )}
        {!isFillingEnabled ? <SerialsFormTrigger /> : null}

        <FormDescription className={`${isError ? 'text-red-500' : ''}`}>
          {isError}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
