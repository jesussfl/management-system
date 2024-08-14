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
import { useItemCardContext } from '@/lib/context/selected-item-card-context'
import { SerialsFormTrigger } from './serials-form'
import { Combobox } from '@/modules/common/components/combobox'
import { NumericFormat } from 'react-number-format'
export const ReceptionFieldsByQuantity = ({}: {}) => {
  const { control, setValue, watch, ...form } = useFormContext()
  const [pedidos, setPedidos] = useState<ComboboxData[]>([])
  const { itemData, index, isEditing, section } = useItemCardContext()
  const itemId = itemData.id
  const packageName = itemData.unidad_empaque?.nombre

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
    <div className="flex flex-col gap-2">
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
        render={({ field: { value, onChange, ref, ...field } }) => (
          <FormItem className="flex flex-1 items-center justify-between gap-2">
            <FormLabel className="w-[12rem]">Cantidad recibida:</FormLabel>

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
                    setValue(`renglones.${index}.seriales`, [])
                  }}
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
        render={({ field: { value, onChange, ref, ...field } }) => (
          <FormItem className="flex flex-1 items-center justify-between gap-2">
            <FormLabel className="w-[12rem]">
              Precio en Bs.
              <p className="text-sm text-gray-500">(opcional):</p>
            </FormLabel>

            <div className="flex w-[150px] flex-col">
              <FormControl>
                <NumericFormat
                  className="border-1 rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...field}
                  allowNegative={false}
                  thousandSeparator=""
                  suffix={` Bs`}
                  decimalScale={0}
                  getInputRef={ref}
                  value={value || ''}
                  onValueChange={({ floatValue }) => {
                    onChange(floatValue)
                  }}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`renglones.${index}.codigo_solicitud`}
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel className="w-[12rem]">
              Código de Solicitud:
              <p className="text-sm text-gray-500">(opcional):</p>
            </FormLabel>
            <div className="flex w-full flex-1 justify-end">
              <Combobox
                name={field.name}
                form={{ ...form, control, setValue }}
                field={field}
                data={pedidos}
                isValueString={false}
              />
            </div>
            <FormMessage />
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
          <FormItem className="flex flex-1 items-center justify-between gap-2">
            <FormLabel className="w-[12rem] leading-5">
              Fecha de fabricación
              <p className="text-sm text-gray-500">(opcional):</p>
            </FormLabel>
            <div className="flex flex-1 justify-end">
              <DatePicker
                placeholderText="Seleccionar fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                locale={es}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="d MMMM, yyyy"
                maxDate={new Date()}
                className="border-1 w-[150px] rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <FormItem className="flex items-center justify-between gap-2">
            <FormLabel className="w-[12rem] leading-5">
              Fecha de vencimiento
              <p className="text-sm text-gray-500">(opcional):</p>
            </FormLabel>
            <div className="flex flex-1 justify-end">
              <DatePicker
                placeholderText="Seleccionar fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                locale={es}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="d MMMM, yyyy"
                minDate={watch(`renglones.${index}.fecha_fabricacion`)}
                className="border-1 w-[150px] rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <FormItem className="flex flex-1 items-center justify-between gap-2">
            <FormLabel className="w-[12rem]">
              Fabricante
              <p className="text-sm text-gray-500">(opcional):</p>
            </FormLabel>

            <div className="w-full flex-1">
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
        name={`renglones.${index}.observacion`}
        rules={{
          maxLength: {
            value: 125,
            message: 'La observación no puede superar los 125 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{`Observación (opcional):`}</FormLabel>

            <FormControl>
              <Input type="text" {...field} value={field.value || ''} />
            </FormControl>
            <FormDescription>
              {`La observación no puede superar los 125 caracteres`}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {!isEditing && <SerialsFormTrigger />}
    </div>
  )
}
