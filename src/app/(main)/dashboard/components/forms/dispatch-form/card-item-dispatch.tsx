'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { getSerialsByItemEnabled } from '@/lib/actions/serials'
import { Loader2, MousePointerClickIcon } from 'lucide-react'
import { DataTable } from '@/modules/common/components/table/data-table'
import { serialSelectorColumns } from '../../columns/serial-selector-columns'
import { NumericFormat } from 'react-number-format'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Separator } from '@/modules/common/components/separator/separator'
import { SelectedSerialForDispatch } from '@/lib/types/dispatch-types'

export const CardItemDispatch = () => {
  const { itemData, ...item } = useItemCardContext()

  return (
    <Card
      key={itemData.id}
      className={`flex flex-col gap-4 ${item.isError ? 'border-red-400' : ''}`}
    >
      <SelectedItemCardHeader />
      {item.isPackageForLiquids ? (
        <ConsumableItemContent />
      ) : (
        <DefaultItemContent />
      )}
    </Card>
  )
}

const DefaultItemContent = () => {
  const { watch, control, setValue } = useFormContext()
  const { itemData, ...item } = useItemCardContext()
  const showSerialSelector = watch(`renglones.${item.index}.manualSelection`)
  const packageName = itemData.unidad_empaque?.nombre

  return (
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
              <FormLabel className="w-[12rem]">Cantidad a despachar:</FormLabel>

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
                  Stock disponible: {itemData.stock_actual}
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
  )
}
const ConsumableItemContent = () => {
  const { control, setValue } = useFormContext()
  const { itemData, setItemsWithoutSerials, ...item } = useItemCardContext()

  return (
    <CardContent className="flex flex-1 flex-col justify-start gap-8">
      <FormField
        control={control}
        name={`renglones.${item.index}.es_despacho_liquidos`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>
                Despacho por:{' '}
                {itemData.unidad_empaque?.tipo_medida.toLowerCase()}
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(value) => {
                  field.onChange(value)
                  setValue(`renglones.${item.index}.seriales`, [])
                }}
                disabled={item.isEditing}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <SerialSelectorTrigger />

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
  )
}
const SerialSelectorTrigger = () => {
  const { itemData, index: itemIndex, isEditing } = useItemCardContext()
  const [isPending, startTransition] = useTransition()
  const { watch, trigger } = useFormContext()
  const { toast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [serials, setSerials] = useState<SerialWithRenglon[]>([])
  const itemId = itemData.id
  const selectedSerials: SelectedSerialForDispatch[] = watch(
    `renglones.${itemIndex}.seriales`
  )

  const isDispatchByUnit = !watch(`renglones.${itemIndex}.es_despacho_liquidos`)
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
      <p className="text-sm font-semibold text-foreground">
        Seleccionados: {selectedSerials?.length}
      </p>

      {!isDispatchByUnit
        ? selectedSerials?.map((serial, index) => (
            <div key={serial.id} className="flex flex-col gap-2">
              <div className="flex flex-1 flex-row justify-between gap-1">
                <p className="text-sm font-semibold text-foreground">
                  Serial: {serial.serial}
                </p>

                <p className="text-sm font-semibold text-foreground">
                  Cantidad despachada: {serial.peso_despachado}{' '}
                  {itemData.unidad_empaque?.tipo_medida}
                </p>
              </div>
              <Separator />
            </div>
          ))
        : null}

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
            <p className="text-xl font-semibold text-foreground">
              Selecciona los seriales de {itemData.nombre}
            </p>
            <p className="text-sm text-foreground">
              Seleccionados: {selectedSerials?.length}
            </p>

            {isPending ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <DefaultSerialSelector
                serials={serials}
                selectedSerials={selectedSerials}
              />
            )}

            <Button
              className="sticky bottom-8 left-8 w-[200px]"
              variant={'default'}
              onClick={() => {
                const isSomeFieldEmpty = selectedSerials.some(
                  (selectedSerial, index) => {
                    const max = selectedSerial.peso_actual
                    if (selectedSerial.peso_despachado > max) {
                      trigger(
                        `renglones.${itemIndex}.seriales.${index}.peso_despachado`
                      )

                      return true
                    }

                    return !selectedSerial.peso_despachado
                  }
                )

                if (
                  isSomeFieldEmpty &&
                  watch(`renglones.${itemIndex}.es_despacho_liquidos`)
                ) {
                  toast({
                    title:
                      'Hay campos vacios o incorrectos, por favor revisa los datos',
                    variant: 'destructive',
                  })
                  return
                }
                toogleModal()
              }}
            >
              Listo
            </Button>
          </div>
        </ModalForm>
      )}
    </div>
  )
}

const DefaultSerialSelector = ({
  serials = [],
  selectedSerials = [],
}: {
  serials: SerialWithRenglon[]
  selectedSerials: SelectedSerialForDispatch[]
}) => {
  const { itemData, index: itemIndex } = useItemCardContext()
  const { control, setValue, watch, ...form } = useFormContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const [displaySerials, setDisplaySerials] =
    useState<SelectedSerialForDispatch[]>(selectedSerials)

  const itemId = itemData.id
  const isDispatchByUnit = !watch(`renglones.${itemIndex}.es_despacho_liquidos`)

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
              peso_despachado: 0,
              peso_actual: nonExistingSerial?.peso_actual,
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
    <div className="flex gap-12">
      <div className="max-h-[600px] flex-1 overflow-x-auto">
        <DataTable
          columns={serialSelectorColumns}
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
      {isDispatchByUnit ? null : (
        <div className="mb-8 grid flex-1 gap-4 xl:grid-cols-2">
          {isTimerActive ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            displaySerials?.map((serial, index) => (
              <Card key={serial.id}>
                <CardHeader>
                  <CardTitle className="text-md font-medium text-foreground">
                    {`Serial: ${serial.serial}`}
                  </CardTitle>
                  <CardDescription>{`Peso Actual: ${
                    serial.peso_actual + ' ' + itemData.tipo_medida_unidad
                  }`}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    control={control}
                    name={`renglones.${itemIndex}.seriales.${index}.peso_despachado`}
                    rules={{
                      required: 'Peso requerido',
                      max: {
                        value: serial.peso_actual,
                        message: `Maximo ${
                          serial.peso_actual
                        } ${itemData.tipo_medida_unidad.toLowerCase()}`,
                      },
                    }}
                    render={({ field: { value, onChange, ref, ...field } }) => {
                      return (
                        <FormItem className="mb-4 flex flex-col rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm text-foreground">
                              Peso a despachar
                            </FormLabel>
                            <FormDescription>
                              {` (Máximo. ${
                                serial.peso_actual
                              } ${itemData.tipo_medida_unidad.toLowerCase()})`}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <NumericFormat
                              className="border-1 rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              {...field}
                              allowNegative={false}
                              thousandSeparator=""
                              suffix={` ${itemData.tipo_medida_unidad.toLowerCase()}`}
                              decimalScale={2}
                              getInputRef={ref}
                              value={value}
                              onValueChange={({ floatValue }) => {
                                onChange(floatValue || '')
                                form.clearErrors(field.name)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
