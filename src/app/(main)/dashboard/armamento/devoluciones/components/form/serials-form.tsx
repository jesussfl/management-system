'use client'

import { useFormContext } from 'react-hook-form'

import { CardTitle } from '@/modules/common/components/card/card'
import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  getDispatchedSerialsByItemId,
  getSerialsByItemId,
} from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { SerialWithRenglon } from '@/types/types'
import { columns } from './serial-columns'

export function SerialsFormNew({
  index: indexForm,
  id,
  isEditEnabled = false,
  returnId,
}: {
  index: number
  id: number
  isEditEnabled?: boolean
  returnId?: number
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

    startTransition(() => {
      getDispatchedSerialsByItemId(id, isEditEnabled).then((serials) => {
        setSerials(serials)

        if (selectedSerials.length > 0) {
          const filteredSerials = serials.filter((serial) =>
            selectedSerials.includes(serial.serial)
          )

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
          onSelectedRowsChange={setSelectedData}
          isColumnFilterEnabled={false}
          selectedData={selectedItems}
          setSelectedData={setSelectedItems}
        />
      </div>
    </div>
  )
}
