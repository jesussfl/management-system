import { useCallback, useEffect, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { PedidoFormValues } from '../../components/forms/orders-form'
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
  const { append, remove } = useFieldArray<PedidoFormValues>({
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
    (lastSelectedRow: any) => {
      if (lastSelectedRow) {
        append({
          id_renglon: lastSelectedRow.id,
          cantidad: 0,
          observacion: null,
        })
        setSelectedRowsData((prev) => {
          if (prev.find((item) => item.id === lastSelectedRow.id)) {
            const index = prev.findIndex(
              (item) => item.id === lastSelectedRow.id
            )
            remove(index)
            return prev.filter((item) => item.id !== lastSelectedRow.id)
          } else {
            return [...prev, lastSelectedRow]
          }
        })
      }
    },
    [append, remove]
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
