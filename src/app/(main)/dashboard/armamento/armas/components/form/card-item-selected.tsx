'use client'
import { Input } from '@/modules/common/components/input/input'
import { useEffect } from 'react'
import { cn } from '@/utils/utils'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Box, Trash } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

// import { RenglonType } from '@/types/types'
import { Calendar } from '@/modules/common/components/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import ModalForm from '@/modules/common/components/modal-form'
import { SerialsForm } from './serials-form'
import { Prisma } from '@prisma/client'
// import { DateTimePicker } from '@/modules/common/components/date-time-picker'
// import { DateTimePicker } from '@/modules/common/components/date-time-picker'
type RenglonType = Prisma.RenglonGetPayload<{
  include: { unidad_empaque: true; recepciones: true }
}>
export const CardItemSelected = ({
  item,
  index,
  deleteItem,
  isEmpty,
  setItemsWithoutSerials,
}: {
  item: RenglonType
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const { watch, control, setValue } = useFormContext()

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

        <Trash
          onClick={() => deleteItem(index)}
          className="h-5 w-5 text-red-800 cursor-pointer"
        />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-end">
        <FormField
          control={control}
          name={`renglones.${index}.codigo_solicitud`}
          render={({ field }) => (
            <FormItem className="items-center flex flex-1 justify-between gap-2">
              <FormLabel className="w-[12rem]">{`Código de solicitud (opcional):`}</FormLabel>

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
                  <Input
                    type="number"
                    {...field}
                    onChange={(event) => {
                      field.onChange(parseInt(event.target.value))
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
          name={`renglones.${index}.fecha_fabricacion`}
          render={({ field }) => (
            <FormItem className="items-center flex flex-1 justify-between gap-2">
              <FormLabel className="w-[12rem]">Fecha de fabricación:</FormLabel>
              <div className="flex-1 w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value || '')}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`renglones.${index}.fecha_vencimiento`}
          render={({ field }) => (
            <FormItem className=" items-center flex  justify-between gap-2">
              <FormLabel className="w-[12rem]">Fecha de vencimiento:</FormLabel>
              <div className="flex-1 w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value || '')}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                    type="text"
                    pattern="[0-9]*[.,]?[0-9]*"
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
            disabled={!watch(`renglones.${index}.cantidad`)}
          >
            <SerialsForm
              index={index}
              id={watch(`renglones.${index}.id`)}
              quantity={watch(`renglones.${index}.cantidad`)}
            />
          </ModalForm>
        </div>
        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
