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
import { SerialsFormNew } from './serials-form'
import { Input } from '@/modules/common/components/input/input'
import { Button } from '@/modules/common/components/button'
import { SelectedItemCardHeader } from '../../selected-item-card-header'
import { useItemCardContext } from '@/lib/context/selected-item-card-context'

export const SelectedItemCard = () => {
  const { watch, control } = useFormContext()
  const { itemData, isError, isEditing, index, setItemsWithoutSerials } =
    useItemCardContext()
  const serialsLength = watch(`renglones.${index}.seriales`).length
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)
  useEffect(() => {
    if (serialsLength > 0 && setItemsWithoutSerials) {
      setItemsWithoutSerials((prev) => {
        return prev.filter((id) => id !== itemData.id)
      })
    }
  }, [serialsLength, setItemsWithoutSerials, itemData.id])

  return (
    <Card
      key={itemData.id}
      className={`flex flex-col gap-4 ${isError ? 'border-red-400' : ''}`}
    >
      <SelectedItemCardHeader />
      <CardContent className="flex flex-1 flex-col justify-start gap-4">
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
            <FormItem className="flex flex-1 flex-col gap-2">
              <FormLabel className="w-[12rem]">{`Observación:`}</FormLabel>

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
          disabled={isError || isEditing ? true : false}
          open={isModalOpen}
          customToogleModal={toogleModal}
        >
          <>
            <SerialsFormNew
              index={index}
              id={itemData.id}
              isEditEnabled={isEditing}
            />
            <Button
              className="sticky bottom-8 left-8 w-[200px]"
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

        <FormDescription className={`${isError ? 'text-red-500' : ''}`}>
          {isError}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
