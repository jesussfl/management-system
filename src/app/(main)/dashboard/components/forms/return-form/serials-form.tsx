'use client'

import { useFormContext } from 'react-hook-form'

import { CardTitle } from '@/modules/common/components/card/card'
import { useEffect, useState, useTransition } from 'react'
import { getDispatchedSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { SerialWithRenglon } from '@/types/types'
import { serialSelectorColumns } from '../../columns/serial-selector-columns'

export function SerialsFormNew({
  index: indexForm,
  id,
  isEditEnabled = false,
}: {
  index: number
  id: number
  isEditEnabled?: boolean
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
            selectedSerials.includes(serial.id)
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
      selectedData.map((item) => item.id),
      {
        shouldDirty: true,
      }
    )
  }, [selectedData, setValue, indexForm])

  if (isPending) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col gap-0 overflow-y-auto p-8">
      <div className="flex flex-col gap-4 p-8">
        <CardTitle>Selecciona los seriales</CardTitle>

        <DataTable
          columns={serialSelectorColumns}
          data={serials}
          onSelectedRowsChange={setSelectedData}
          defaultSelection={selectedItems}
        />
      </div>
    </div>
  )
}
