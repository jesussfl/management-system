'use client'
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

import { Card, CardContent } from '@/modules/common/components/card/card'
import ModalForm from '@/modules/common/components/modal-form'
import { RenglonWithAllRelations } from '@/types/types'
import { SerialsFormNew } from './serials-form'
import { Input } from '@/modules/common/components/input/input'
import { Button } from '@/modules/common/components/button'
import { SelectedItemCardHeader } from '../../selected-item-card-header'

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
      <SelectedItemCardHeader />
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
