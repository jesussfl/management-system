'use client'
import { useEffect, useState } from 'react'
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
import { RenglonWithAllRelations } from '@/types/types'
import { Box, Trash } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { SerialSelector } from './serial-selector'
import { Button } from '@/modules/common/components/button'

export const CardItemDispatch = ({
  item,
  index,
  deleteItem,
  isEmpty,
  isError,
  dispatchId,
  setItemsWithoutSerials,
  isEditEnabled = false,
  totalStock,
}: {
  item: RenglonWithAllRelations
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  isError?: string | boolean
  isEditEnabled?: boolean
  dispatchId?: number
  totalStock: number
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const { watch, control } = useFormContext()

  const serialsLength = watch(`renglones.${index}.seriales`).length
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)
  useEffect(() => {
    if (serialsLength > 0) {
      setItemsWithoutSerials((prev) => {
        return prev.filter((id) => id !== item.id)
      })
    }
  }, [serialsLength, setItemsWithoutSerials, item.id])

  return (
    <Card
      key={item.id}
      className={`flex flex-col gap-4 ${
        isEmpty || isError ? 'border-red-400' : ''
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Box className="h-6 w-6 " />
          <div>
            <CardTitle className="text-md font-medium text-foreground">
              {item.nombre}
            </CardTitle>
            <CardDescription>
              {`${item.descripcion} - ${item.unidad_empaque.nombre} - Peso: ${
                item.peso || 'Sin definir'
              } ${item.peso ? item.unidad_empaque.abreviacion : ''} `}
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
      <CardContent className="flex flex-col flex-1 justify-start gap-4">
        <FormField
          control={control}
          name={`renglones.${index}.manualSelection`}
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
                  disabled={isEditEnabled}
                />
              </FormControl>
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
        {!watch(`renglones.${index}.manualSelection`) ? (
          <FormField
            control={control}
            name={`renglones.${index}.cantidad`}
            rules={{
              required: 'La cantidad es requerida',

              max: {
                value: totalStock,
                message: 'La cantidad no puede ser mayor al stock disponible',
              },

              validate: (value) => {
                if (
                  !watch(`renglones.${index}.manualSelection`) &&
                  value === 0
                ) {
                  return 'La cantidad debe ser mayor a 0'
                }
              },
            }}
            render={({ field }) => (
              <FormItem className="items-center flex flex-1 justify-between gap-2">
                <FormLabel className="w-[12rem]">
                  Cantidad a despachar
                </FormLabel>
                <div className="flex-1 w-full">
                  <FormControl>
                    <div className="flex flex-row gap-2 items-center">
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(parseInt(event.target.value))
                        }
                        disabled={isEditEnabled}
                      />
                      <p className="text-foreground text-sm">
                        {`${item.unidad_empaque.nombre}(s)`}
                      </p>{' '}
                    </div>
                  </FormControl>
                  <FormDescription className="">
                    {isEditEnabled
                      ? `Cuando se edita un despacho la cantidad debe modificarse
                      seleccionando los seriales manualmente`
                      : `Cantidad disponible: ${totalStock}`}
                  </FormDescription>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        ) : (
          <>
            <ModalForm
              triggerName={`${
                watch(`renglones.${index}.seriales`).length > 0
                  ? 'Ver seriales'
                  : 'Seleccionar seriales'
              }  `}
              triggerVariant={`${
                watch(`renglones.${index}.seriales`).length > 0
                  ? 'outline'
                  : 'default'
              }`}
              closeWarning={false}
              className="max-h-[80vh]"
              disabled={isEmpty ? true : false}
              open={isModalOpen}
              customToogleModal={toogleModal}
            >
              <>
                <SerialSelector
                  index={index}
                  id={item.id}
                  dispatchId={dispatchId}
                  isEditEnabled={isEditEnabled}
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

            <FormDescription>
              Seriales seleccionados:{' '}
              {watch(`renglones.${index}.seriales`).length}
            </FormDescription>
          </>
        )}

        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
