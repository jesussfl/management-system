'use client'
import { Input } from '@/modules/common/components/input/input'
import { useEffect } from 'react'
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
import { Switch } from '@/modules/common/components/switch/switch'
import { RenglonWithAllRelations } from '@/types/types'
import { SerialsFormNew } from '../../../despachos/components/form/serials-form-new'

export const SelectedItemCard = ({
  item,
  index,
  deleteItem,
  isEmpty,
  isError,
  setItemsWithoutSerials,
}: {
  item: RenglonWithAllRelations
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  isError?: string | boolean
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const { watch, control } = useFormContext()
  const receptions = item.recepciones.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  const dispatchedSerials = item.despachos.reduce(
    (total, item) => total + item.seriales.length,
    0
  )

  const totalStock = receptions - dispatchedSerials
  const serialsLength = watch(`renglones.${index}.seriales`).length

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

        <Trash
          onClick={() => deleteItem(index)}
          className="h-5 w-5 text-red-800 cursor-pointer"
        />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-start gap-4">
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
        >
          <SerialsFormNew index={index} id={item.id} />
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
