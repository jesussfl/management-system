'use client'

import { useFormContext } from 'react-hook-form'

import { CardTitle } from '@/modules/common/components/card/card'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { getSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { SerialWithRenglon } from '@/types/types'
import { columns } from './serial-columns'

export function SerialsFormNew({
  index: indexForm,
  id,
}: {
  index: number
  id: number
}) {
  const { setValue, watch } = useFormContext()
  const [isPending, startTransition] = useTransition()
  const [serials, setSerials] = useState<SerialWithRenglon[]>([])
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean
  }>({})
  const [selectedData, setSelectedData] = useState<SerialWithRenglon[]>([])

  useEffect(() => {
    const selectedSerials = watch(`renglones.${indexForm}.seriales`)

    console.log(selectedSerials, 'selectedSerials')
    startTransition(() => {
      getSerialsByItemId(id).then((serials) => {
        setSerials(serials)

        if (selectedSerials.length > 0) {
          const filteredSerials = serials.filter((serial) =>
            selectedSerials.includes(serial.serial)
          )

          console.log(filteredSerials, 'filtereeeeeed')
          const selectedItems = filteredSerials.reduce(
            (acc, serial) => {
              acc[serial.id] = true
              return acc
            },
            {} as { [key: number]: boolean }
          )

          setSelectedItems(selectedItems)
          setSelectedData(filteredSerials)
        }
      })
    })
  }, [id])

  const handleTableSelect = useCallback(
    (lastSelectedRow: SerialWithRenglon) => {
      if (lastSelectedRow) {
        setSelectedData((prev) => {
          if (prev.find((serial) => serial.id === lastSelectedRow.id)) {
            return prev.filter((item) => item.id !== lastSelectedRow.id)
          } else {
            return [...prev, lastSelectedRow]
          }
        })
      }
    },
    []
  )

  useEffect(() => {
    setValue(
      `renglones.${indexForm}.seriales`,
      selectedData.map((item) => item.serial),
      {
        shouldDirty: true,
      }
    )
  }, [selectedData, setValue])

  if (isPending) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col gap-0 p-8 overflow-y-auto">
      <div className="flex flex-col gap-4 p-8">
        <CardTitle>Selecciona los seriales</CardTitle>

        <DataTable
          columns={columns}
          data={serials}
          onSelectedRowsChange={handleTableSelect}
          isColumnFilterEnabled={false}
          selectedData={selectedItems}
          setSelectedData={setSelectedItems}
        />
      </div>
    </div>
  )
}
