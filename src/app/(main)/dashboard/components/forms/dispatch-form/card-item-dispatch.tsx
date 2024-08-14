'use client'
import { useEffect, useState, useTransition } from 'react'
import {
  Card,
  CardContent,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'
import ModalForm from '@/modules/common/components/modal-form'
import { Switch } from '@/modules/common/components/switch/switch'

import { useFormContext } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { SelectedItemCardHeader } from '../../selected-item-card-header'
import { useItemCardContext } from '@/lib/context/selected-item-card-context'
import { SerialWithRenglon } from '@/types/types'
import { getSerialsByItemId } from '@/lib/actions/serials'
import { Loader2 } from 'lucide-react'
import { DataTable } from '@/modules/common/components/table/data-table'
import { serialSelectorColumns } from '../../columns/serial-selector-columns'
import { NumericFormat } from 'react-number-format'

export const CardItemDispatch = () => {
  const { watch, control, setValue } = useFormContext()
  const { itemData, setItemsWithoutSerials, ...item } = useItemCardContext()
  const serialsLength = watch(`renglones.${item.index}.seriales`).length
  const showSerialSelector = watch(`renglones.${item.index}.manualSelection`)
  const packageName = itemData.unidad_empaque?.nombre
  useEffect(() => {
    if (serialsLength > 0) {
      setItemsWithoutSerials((prev) => {
        return prev.filter((id) => id !== itemData.id)
      })
    }
  }, [serialsLength, setItemsWithoutSerials, itemData.id])

  return (
    <Card
      key={itemData.id}
      className={`flex flex-col gap-4 ${item.isError ? 'border-red-400' : ''}`}
    >
      <SelectedItemCardHeader />

      <CardContent className="flex flex-1 flex-col justify-start gap-8">
        <FormField
          control={control}
          name={`renglones.${item.index}.manualSelection`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Seleccionar seriales manualmente</FormLabel>
                <FormDescription>
                  Esta opcion te permitira seleccionar los seriales especificos
                  que deseas despachar
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={item.isEditing}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!showSerialSelector ? (
          <FormField
            control={control}
            name={`renglones.${item.index}.cantidad`}
            rules={{
              required: 'La cantidad es requerida',

              max: {
                value: itemData.stock_actual,
                message: 'La cantidad no puede ser mayor al stock disponible',
              },

              validate: (value) => {
                if (!showSerialSelector && value === 0) {
                  return 'La cantidad debe ser mayor a 0'
                }
              },
            }}
            render={({ field: { value, onChange, ref, ...field } }) => (
              <FormItem className="flex flex-1 items-center justify-between gap-2">
                <FormLabel className="w-[12rem]">
                  Cantidad a despachar:
                </FormLabel>

                <div className="flex w-[150px] flex-col">
                  <FormControl>
                    <NumericFormat
                      className="border-1 rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...field}
                      allowNegative={false}
                      thousandSeparator=""
                      suffix={` ${packageName ? packageName + '(s)' : 'Unidades'}`}
                      decimalScale={0}
                      getInputRef={ref}
                      value={value || ''}
                      onValueChange={({ value, floatValue }) => {
                        onChange(floatValue)
                        setValue(`renglones.${item.index}.seriales`, [])
                      }}
                      disabled={item.isEditing}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximo: {itemData.stock_actual}
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        ) : (
          <SerialSelectorTrigger />
        )}

        <FormField
          control={control}
          name={`renglones.${item.index}.observacion`}
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

        <FormDescription className={'text-red-500'}>
          {item.isError}
        </FormDescription>
      </CardContent>
    </Card>
  )
}

const SerialSelectorTrigger = () => {
  const { watch } = useFormContext()
  const { itemData, setItemsWithoutSerials, ...item } = useItemCardContext()
  const serialsLength = watch(`renglones.${item.index}.seriales`).length

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)
  return (
    <div className="flex items-center justify-between gap-2">
      <FormDescription>Seriales seleccionados: {serialsLength}</FormDescription>
      <ModalForm
        triggerName={
          serialsLength > 0 ? 'Ver seriales' : 'Seleccionar seriales'
        }
        triggerVariant={serialsLength.length > 0 ? 'outline' : 'default'}
        closeWarning={false}
        className="max-h-[80vh]"
        disabled={item.isError ? true : false}
        open={isModalOpen}
        customToogleModal={toogleModal}
      >
        <>
          <SerialSelector />
          <Button
            className="sticky bottom-8 left-8 w-[200px]"
            variant={'default'}
            onClick={() => setIsModalOpen(false)}
          >
            Listo
          </Button>
        </>
      </ModalForm>
    </div>
  )
}

const SerialSelector = () => {
  const [selectedData, setSelectedData] = useState<SerialWithRenglon[]>([])
  const [serials, setSerials] = useState<SerialWithRenglon[]>([])

  const { itemData, isEditing, index: itemIndex } = useItemCardContext()
  const [isPending, startTransition] = useTransition()
  const { setValue, watch } = useFormContext()

  useEffect(() => {
    const selectedSerials = watch(`renglones.${itemIndex}.seriales`)
    startTransition(() => {
      getSerialsByItemId(itemData.id, isEditing).then((serials) => {
        setSerials(serials)

        if (selectedSerials.length > 0) {
          const filteredSerials = serials.filter((serial) =>
            selectedSerials.includes(serial.serial)
          )

          setSelectedData(filteredSerials)
        }
      })
    })
  }, [itemData.id, isEditing, watch, itemIndex])

  useEffect(() => {
    setValue(
      `renglones.${itemIndex}.seriales`,
      selectedData.map((item) => item.serial),
      {
        shouldDirty: true,
      }
    )
  }, [selectedData, setValue, itemIndex])

  return (
    <div className="flex flex-col gap-4 p-8">
      <CardTitle>Selecciona los seriales</CardTitle>
      {isPending ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <DataTable
          columns={serialSelectorColumns}
          data={serials}
          onSelectedRowsChange={setSelectedData}
          defaultSelection={selectedData.reduce(
            (acc, serial) => {
              acc[serial.id] = true
              return acc
            },
            {} as { [key: number]: boolean }
          )}
          isStatusEnabled={false}
        />
      )}
    </div>
  )
}
