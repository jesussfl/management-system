'use client'
import { Input } from '@/modules/common/components/input/input'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { getAllOrdersByItemId } from '@/lib/actions/reception'
import { ComboboxData } from '@/types/types'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { useSelectedItemCardContext } from '../../../../../../lib/context/selected-item-card-context'
import { SerialsFormTrigger } from './serials-form'
import { Combobox } from '@/modules/common/components/combobox'

export const ReceptionFieldsByQuantity = ({}: {}) => {
  const { control, setValue, watch } = useFormContext()
  const [pedidos, setPedidos] = useState<ComboboxData[]>([])
  const { itemData, index, isEditing, section } = useSelectedItemCardContext()
  const itemId = itemData.id
  useEffect(() => {
    getAllOrdersByItemId(itemId, section).then((data) => {
      const transformedData = data.map((order) => ({
        value: order.id,
        label: `Código: ${order.id}`,
      }))

      setPedidos(transformedData)
    })
  }, [itemId, section])

  return (
    <>
      <FormField
        control={control}
        name={`renglones.${index}.codigo_solicitud`}
        render={({ field }) => (
          <FormItem className="flex justify-between items-center">
            <FormLabel>Código de Solicitud (opcional):</FormLabel>
            <Combobox
              name={field.name}
              form={control}
              field={field}
              data={pedidos}
            />

            <FormMessage />
          </FormItem>
        )}
      />

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
              (itemData.stock_maximo || 999) -
              itemData.recepciones.reduce(
                (total, item) => total + item.cantidad,
                0
              ),
            message: 'La cantidad no puede ser mayor al stock maximo',
          },
        }}
        render={({ field }) => (
          <FormItem className="items-center flex flex-1 justify-between gap-2">
            <FormLabel className="w-[12rem]">Cantidad recibida:</FormLabel>

            <div className="flex-1 w-full">
              <FormControl>
                <div className="flex flex-row gap-2 items-center">
                  <Input
                    className="flex-1"
                    type="number"
                    {...field}
                    disabled={isEditing}
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(parseInt(event.target.value))
                      setValue(`renglones.${index}.seriales`, [])
                    }}
                  />
                  <p className="text-foreground text-sm">
                    {`${
                      itemData.unidad_empaque?.nombre
                        ? itemData.unidad_empaque?.nombre + '(s)'
                        : 'Unidades'
                    }`}
                  </p>{' '}
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`renglones.${index}.fecha_fabricacion`}
        rules={{
          validate: (value) => {
            if (value > new Date())
              return 'La fecha de fabricación no debe ser mayor a la fecha actual'

            if (
              value > watch(`renglones.${index}.fecha_vencimiento`) &&
              watch(`renglones.${index}.fecha_vencimiento`)
            )
              return 'La fecha de fabricación no puede ser mayor a la fecha de vencimiento'
          },
        }}
        render={({ field }) => (
          <FormItem className="items-center flex flex-1 justify-between gap-2">
            <FormLabel className="w-[12rem]">Fecha de fabricación:</FormLabel>
            <div className="flex-1 w-full">
              <DatePicker
                placeholderText="Seleccionar fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                locale={es}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />

              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`renglones.${index}.fecha_vencimiento`}
        rules={{
          validate: (value) => {
            if (value < watch(`renglones.${index}.fecha_fabricacion`))
              return 'La fecha de vencimiento no puede ser menor a la fecha de fabricación'
          },
        }}
        render={({ field }) => (
          <FormItem className=" items-center flex  justify-between gap-2">
            <FormLabel className="w-[12rem]">Fecha de vencimiento:</FormLabel>
            <div className="flex-1 w-full">
              <DatePicker
                placeholderText="Seleccionar fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                locale={es}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={watch(`renglones.${index}.fecha_fabricacion`)}
              />

              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`renglones.${index}.fabricante`}
        render={({ field }) => (
          <FormItem className="items-center flex flex-1 justify-between gap-2">
            <FormLabel className="w-[12rem]">{`Fabricante (opcional):`}</FormLabel>

            <div className="flex-1 w-full">
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`renglones.${index}.precio`}
        render={({ field }) => (
          <FormItem className="items-center flex flex-1 justify-between gap-2">
            <FormLabel className="w-[12rem]">{`Precio en Bs (opcional):`}</FormLabel>

            <div className="flex-1 w-full">
              <FormControl>
                <Input
                  inputMode="decimal"
                  type="number"
                  // pattern="[0-9]*[.,]?[0-9]*"
                  {...field}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(parseFloat(event.target.value))
                  }
                />
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
                <Input type="text" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                {`La observación no puede superar los 125 caracteres`}
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <SerialsFormTrigger />
    </>
  )
}
