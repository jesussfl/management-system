import { useCallback, useEffect, useState } from 'react'

import { ItemsWithAllRelations } from '../actions/item'
import { RowSelectionState } from '@tanstack/react-table'

export const useItemSelector = ({
  itemsData,
  fields,
  defaultItems,
  remove,
  append,
  appendObject,
}: {
  itemsData: ItemsWithAllRelations
  fields: any
  defaultItems: any
  remove: (index: number) => void
  append: (item: any) => void
  appendObject: {
    [key: string]: any
  }
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedRowsData, setSelectedRowsData] =
    useState<ItemsWithAllRelations>([])
  useEffect(() => {
    if (defaultItems) {
      const selectedItems = defaultItems.reduce(
        (acc: any, item: any) => {
          acc[item.id_renglon] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )
      const filteredItems = itemsData.filter((item) => selectedItems[item.id])
      setRowSelection(selectedItems)
      setSelectedRowsData(filteredItems)
    }
  }, [defaultItems, itemsData])

  const handleTableSelect = useCallback(
    (rowsData: ItemsWithAllRelations, rowSelection: RowSelectionState) => {
      if (!rowsData) return

      const itemIds = rowsData.map((item) => item.id)

      fields.forEach((field: any, index: number) => {
        if (itemIds.length === 0) return

        if (!itemIds.includes(field.id_renglon)) {
          remove(index)
        }
      })

      rowsData.forEach((item) => {
        const exists = fields.some((field: any) => field.id_renglon === item.id)
        if (!exists) {
          append({ ...appendObject, id_renglon: item.id })
        }
      })

      setSelectedRowsData(rowsData)
      setRowSelection(rowSelection)
    },
    [fields, remove, append, appendObject]
  )

  const deleteItem = (index: number) => {
    setSelectedRowsData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...rowSelection }
        if (item.id === selectedRowsData[index].id) {
          delete nuevoObjeto[item.id]
          setRowSelection(nuevoObjeto)
        }
        return item.id !== selectedRowsData[index].id
      })
    })
    remove(index)
  }
  return {
    rowSelection,
    selectedRowsData,
    handleTableSelect,
    deleteItem,
  }
}
