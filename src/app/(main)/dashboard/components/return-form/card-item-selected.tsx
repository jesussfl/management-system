'use client'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Box, Trash } from 'lucide-react'
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
import { RenglonWithAllRelations } from '@/types/types'
import { SerialsFormNew } from './serials-form'
import { Input } from '@/modules/common/components/input/input'
import { Button } from '@/modules/common/components/button'

export const SelectedItemCard = ({
  item,
  index,
  deleteItem,
  isEmpty,
  isError,
  setItemsWithoutSerials,
  returnId,
  isEditEnabled,
}: {
  item: RenglonWithAllRelations
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  isError?: string | boolean
  isEditEnabled?: boolean
  returnId?: number
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
              {`${item.descripcion} - ${item.unidad_empaque.nombre} - Peso: ${item.peso} (${item.unidad_empaque.abreviacion}) `}
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
          name={`renglones.${index}.observacion`}
          rules={{
            required: 'La observación es obligatoria',
            maxLength: {
              value: 125,
              message: 'La observación no puede superar los 125 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-col flex-1 gap-2">
              <FormLabel className="w-[12rem]">{`Observación:`}</FormLabel>

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
          disabled={isEmpty || isEditEnabled ? true : false}
          open={isModalOpen}
          customToogleModal={toogleModal}
        >
          <>
            <SerialsFormNew
              index={index}
              id={item.id}
              returnId={returnId}
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
          Seriales seleccionados: {watch(`renglones.${index}.seriales`).length}
        </FormDescription>

        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}