'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
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
import { useCallback, useEffect, useState, useTransition } from 'react'
import { Loader2, MousePointerClickIcon } from 'lucide-react'
import { Button } from '@/modules/common/components/button'
import { useSelectedItemCardContext } from '@/lib/context/selected-item-card-context'
import { SerialWithRenglon } from '@/types/types'
import { DataTable } from '@/modules/common/components/table/data-table'
import { receptionSerialColumns } from '../../../columns/serial-selector-columns'
import { NumericFormat } from 'react-number-format'
import { getSerialsByItemEnabled } from '@/lib/actions/serials'
import { Separator } from '@/modules/common/components/separator/separator'

export type SelectedSerial = {
  id: number
  serial: string
  id_renglon: number
  peso_recibido: number
  condicion?: undefined
}

export const SerialSelectorTrigger = () => {
  const { itemData, index: itemIndex, isEditing } = useSelectedItemCardContext()
  const [isPending, startTransition] = useTransition()
  const { watch } = useFormContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [serials, setSerials] = useState<SerialWithRenglon[]>([])

  const itemId = itemData.id
  const selectedSerials: SelectedSerial[] = watch(
    `renglones.${itemIndex}.seriales`
  )

  const toogleModal = () => setIsModalOpen(!isModalOpen)
  useEffect(() => {
    startTransition(() => {
      getSerialsByItemEnabled(itemId).then((serials) => {
        setSerials(serials)
      })
    })
  }, [itemId])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground font-semibold">
        Seleccionados: {selectedSerials?.length}
      </p>
      {selectedSerials?.map((serial, index) => (
        <div key={serial.id} className="flex flex-col gap-2">
          <div className="flex flex-row justify-between gap-1 flex-1">
            <p className="text-sm text-foreground font-semibold">
              Serial: {serial.serial}
            </p>
            <p className="text-sm text-foreground font-semibold">
              Peso agregado: {serial.peso_recibido}{' '}
              {itemData.unidad_empaque?.tipo_medida}
            </p>
          </div>
          <Separator />
        </div>
      ))}

      {!isEditing && (
        <ModalForm
          triggerName={`Seleccionar seriales`}
          triggerVariant={'default'}
          triggerIcon={<MousePointerClickIcon className="h-4 w-4" />}
          closeWarning={false}
          className="max-h-[80vh] min-w-[80vw]"
          open={isModalOpen}
          customToogleModal={toogleModal}
        >
          <div className="p-24">
            <p className="text-xl text-foreground font-semibold">
              Selecciona los seriales de {itemData.nombre}
            </p>
            <p className="text-sm text-foreground">
              Seleccionados: {selectedSerials?.length}
            </p>

            {isPending ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <SerialSelector
                serials={serials}
                selectedSerials={selectedSerials}
              />
            )}

            <Button
              className="w-[200px] sticky bottom-8 left-8"
              variant={'default'}
              onClick={() => setIsModalOpen(false)}
            >
              Listo
            </Button>
          </div>
        </ModalForm>
      )}
    </div>
  )
}

export const SerialSelector = ({
  serials = [],
  selectedSerials = [],
}: {
  serials: SerialWithRenglon[]
  selectedSerials: SelectedSerial[]
}) => {
  const { control, setValue } = useFormContext()
  const { itemData, index: itemIndex } = useSelectedItemCardContext()
  const [isLoading, setIsLoading] = useState(false)
  const [displaySerials, setDisplaySerials] =
    useState<SelectedSerial[]>(selectedSerials)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const itemId = itemData.id

  const handleTableSelect = useCallback(
    (data: SerialWithRenglon[]) => {
      setIsLoading(true)
      const existingSerials = selectedSerials.filter((selectedSerial) => {
        return data.find((serial) => serial.id === selectedSerial.id)
      })
      const nonExistingSerial = data.find(
        (serial) =>
          !selectedSerials.find(
            (selectedSerial) => serial.id === selectedSerial.id
          )
      )

      const updatedSelectedSerials = nonExistingSerial
        ? [
            ...existingSerials,
            {
              id: nonExistingSerial?.id,
              serial: nonExistingSerial?.serial,
              id_renglon: itemId,
              peso_recibido: 0,
            },
          ]
        : existingSerials

      setValue(`renglones.${itemIndex}.seriales`, updatedSelectedSerials)
      setIsLoading(false)
    },
    [itemIndex, setValue, selectedSerials, itemId]
  )

  useEffect(() => {
    if (!isLoading) {
      setIsTimerActive(true)
      const timer = setTimeout(() => {
        setDisplaySerials(selectedSerials)
        setIsTimerActive(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isLoading, selectedSerials])

  return (
    <div className="flex gap-12 ">
      <div className="max-h-[600px] flex-1 overflow-x-auto">
        <DataTable
          columns={receptionSerialColumns}
          data={serials}
          isStatusEnabled={false}
          onSelectedRowsChange={(rows, selection, loading) => {
            if (loading) return
            handleTableSelect(rows)
          }}
          defaultSelection={
            selectedSerials?.reduce(
              (acc, serial) => {
                acc[serial.id] = true
                return acc
              },
              {} as { [key: number]: boolean }
            ) || {}
          }
        />
      </div>

      <div className="grid xl:grid-cols-2 gap-4 flex-1 mb-8">
        {isTimerActive ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          displaySerials?.map((serial, index) => (
            <Card key={serial.id}>
              <CardHeader>
                <CardTitle className="text-md font-medium text-foreground">
                  {`Serial: ${serial.serial}`}
                </CardTitle>
                <CardDescription>{`Peso Actual:  (Max. ${itemData.peso} ${itemData.tipo_medida_unidad})`}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name={`renglones.${itemIndex}.seriales.${index}.peso_recibido`}
                  render={({ field: { value, onChange, ref, ...rest } }) => {
                    return (
                      <FormItem className="flex flex-col rounded-lg border p-3 shadow-sm mb-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm text-foreground">
                            Peso a registrar
                          </FormLabel>
                        </div>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <NumericFormat
                              className="w-[100px] rounded-md border-1 border-border p-1.5 text-foreground bg-background placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              allowNegative={false}
                              thousandSeparator=""
                              decimalSeparator="."
                              prefix=""
                              decimalScale={2}
                              getInputRef={ref}
                              value={value || ''}
                              onValueChange={({ floatValue }) => {
                                onChange(floatValue)
                              }}
                              {...rest}
                            />
                          </FormControl>
                          <p className="text-sm text-foreground">
                            {itemData.tipo_medida_unidad.toLowerCase()}
                          </p>
                        </div>
                      </FormItem>
                    )
                  }}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
