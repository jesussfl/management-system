import { useCallback, useEffect, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { PedidoFormValues } from '../../../../../components/forms/order-form/orders-form'
import { Prisma } from '@prisma/client'
type RenglonType = Prisma.RenglonGetPayload<{
  include: { unidad_empaque: true; recepciones: true }
}>
export const useHandleTableSelect = (
  control: any,
  isEditEnabled = false,
  renglones:
    | {
        id_renglon: number
        cantidad: number
        observacion?: string | null
      }[]
    | undefined,
  items: RenglonType[]
) => {
  const { fields, append, remove } = useFieldArray<PedidoFormValues>({
    control,
    name: `renglones`,
  })
  const [selectedRows, setSelectedRows] = useState<any>({})
  const [selectedRowsData, setSelectedRowsData] = useState<RenglonType[]>([])

  useEffect(() => {
    if (isEditEnabled && renglones) {
      const selectedItems = renglones

      const itemsToEdit = items.filter((item) => {
        return selectedItems.find((renglon) => renglon.id_renglon === item.id)
      })

      const itemsByKeyAndBoolean = selectedItems.reduce(
        (acc, item) => {
          acc[item.id_renglon] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )

      setSelectedRows(itemsByKeyAndBoolean)
      setSelectedRowsData(itemsToEdit)
    }
  }, [isEditEnabled, renglones, items])

  const handleTableSelect = useCallback(
    (selections: any[]) => {
      if (!selections) return

      // Obtener los IDs de los elementos seleccionados
      const selectionIds = selections.map((item) => item.id)

      // Iterar sobre los elementos actuales y eliminar los que no están en selections
      fields.forEach((field, index) => {
        if (selectionIds.length === 0) return

        if (!selectionIds.includes(field.id_renglon)) {
          remove(index)
        }
      })

      // Agregar los nuevos elementos de selections que no están en fields
      selections.forEach((item) => {
        const exists = fields.some((field) => field.id_renglon === item.id)
        if (!exists) {
          append({
            id_renglon: item.id,
            cantidad: 0,
            observacion: null,
          })
        }
      })

      setSelectedRowsData(selections)
    },
    [append, remove, fields]
  )

  const deleteItem = (index: number) => {
    setSelectedRowsData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedRows }
        if (item.id === selectedRowsData[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedRows(nuevoObjeto)
        }
        return item.id !== selectedRowsData[index].id
      })
    })
    remove(index)
  }

  return {
    handleTableSelect,
    selectedItems: selectedRows,
    setSelectedItems: setSelectedRows,
    selectedItemsData: selectedRowsData,
    unselectItem: deleteItem,
  }
}
