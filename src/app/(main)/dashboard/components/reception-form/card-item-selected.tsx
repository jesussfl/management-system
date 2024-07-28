'use client'
import { Input } from '@/modules/common/components/input/input'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Box, CheckIcon, Trash } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import ModalForm from '@/modules/common/components/modal-form'
import { SerialsForm } from './serials-form'
import { getAllOrdersByItemId } from '../../lib/actions/reception'
import { ComboboxData } from '@/types/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { cn } from '@/utils/utils'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { ItemsWithAllRelations } from '../../lib/actions/item'
type Renglon = ItemsWithAllRelations[number]

export const CardItemSelected = ({
  item,
  index,
  deleteItem,
  isEmpty,
  setItemsWithoutSerials,
  servicio,
  isEditEnabled,
}: {
  item: Renglon
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
  servicio: 'Abastecimiento' | 'Armamento'
  isEditEnabled?: boolean
}) => {
  const { watch, control, setValue } = useFormContext()
  const [pedidos, setPedidos] = useState<ComboboxData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)

  useEffect(() => {
    getAllOrdersByItemId(item.id, servicio).then((data) => {
      const transformedData = data.map((order) => ({
        value: order.id,
        label: `Código: ${order.id}`,
      }))

      setPedidos(transformedData)
    })
  }, [item.id, servicio])

  return (
    <Card
      key={item.id}
      className={`flex flex-col gap-4 ${isEmpty ? 'border-red-400' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Box className="h-6 w-6 " />
          <div>
            <CardTitle className="text-md font-medium text-foreground">
              {item.nombre}
            </CardTitle>
            <CardDescription>
              {`${item.descripcion} - Peso: ${item.peso} (${item.unidad_empaque.abreviacion}) `}
            </CardDescription>
          </div>
        </div>
        {!isEditEnabled ? (
          <Trash
            onClick={() => {
              if (isEditEnabled) return

              deleteItem(index)
            }}
            className="h-5 w-5 text-red-800 cursor-pointer"
          />
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-end">
        <FormField
          control={control}
          name={`renglones.${index}.codigo_solicitud`}
          render={({ field }) => (
            <FormItem className="flex-1 ">
              <FormLabel>Código de Solicitud:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? pedidos.find((pedido) => pedido.value === field.value)
                            ?.label
                        : 'Seleccionar código'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="PopoverContent">
                  <Command>
                    <CommandInput
                      placeholder="Buscar código..."
                      className="h-9"
                    />
                    <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                    <CommandGroup>
                      {pedidos.map((pedido) => (
                        <CommandItem
                          value={pedido.label}
                          key={pedido.value}
                          onSelect={() => {
                            setValue(
                              `renglones.${index}.codigo_solicitud`,
                              pedido.value,
                              {
                                shouldDirty: true,
                              }
                            )
                          }}
                        >
                          {pedido.label}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              pedido.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormDescription>Este campo es opcional</FormDescription>
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
              <FormLabel className="w-[12rem]">Cantidad recibida:</FormLabel>

              <div className="flex-1 w-full">
                <FormControl>
                  <div className="flex flex-row gap-2 items-center">
                    <Input
                      className="flex-1"
                      type="number"
                      {...field}
                      disabled={isEditEnabled}
                      onChange={(event) => {
                        field.onChange(parseInt(event.target.value))
                        setValue(`renglones.${index}.seriales`, [])
                      }}
                    />
                    <p className="text-foreground text-sm">
                      {`${item.unidad_empaque.nombre}(s)`}
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
                  <Input type="text" {...field} />
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
        <div
          onClick={() => {
            if (isEmpty) {
              setItemsWithoutSerials((prev) => {
                return prev.filter((id) => id !== item.id)
              })
            }
          }}
        >
          <ModalForm
            triggerName={`${
              watch(`renglones.${index}.seriales`).length > 0
                ? 'Ver seriales'
                : 'Agregar seriales'
            }  `}
            triggerVariant={`${
              watch(`renglones.${index}.seriales`).length > 0
                ? 'outline'
                : 'default'
            }`}
            closeWarning={false}
            className="max-h-[80vh]"
            disabled={!watch(`renglones.${index}.cantidad`) || isEditEnabled}
            open={isModalOpen}
            customToogleModal={toogleModal}
          >
            <>
              <SerialsForm
                index={index}
                id={watch(`renglones.${index}.id_renglon`)}
                quantity={watch(`renglones.${index}.cantidad`)}
              />
              <Button
                className="w-[200px] sticky bottom-8 left-8"
                variant={'default'}
                onClick={() => setIsModalOpen(false)}
              >
                Listo
              </Button>
            </>
          </ModalForm>
        </div>
        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
