'use client'

import { useFormContext } from 'react-hook-form'

import { CardTitle } from '@/modules/common/components/card/card'
import { useEffect, useState, useTransition } from 'react'
import { getSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { SerialWithRenglon } from '@/types/types'
import { selectSerialColumns } from '../columns/select-serial-columns'

export function SerialSelector({
  index: indexForm,
  id,
  isEditEnabled = false,
  dispatchId,
}: {
  index: number
  id: number
  isEditEnabled?: boolean
  dispatchId?: number
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
      getSerialsByItemId(id, isEditEnabled).then((serials) => {
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
          columns={selectSerialColumns}
          data={serials}
          onSelectedRowsChange={setSelectedData}
          defaultSelection={selectedItems}
          isStatusEnabled={false}
        />
      </div>
    </div>
  )
}
