'use client'
import { DataTable } from '@/modules/common/components/table/data-table'
import { useEffect, useState } from 'react'
import { deleteMultipleItems } from './lib/actions/items'
import { RenglonWithAllRelations } from '@/types/types'
import { RenglonColumns, columns } from './columns'
import { Serial } from '@prisma/client'
import ExportExcelButton from './components/items-export-button'
import { formatExcelData } from './format-function'

export const TableWithExport = ({
  itemsData,
}: {
  itemsData: RenglonWithAllRelations[]
}) => {
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [rowsData, setRowsData] = useState<any[]>([])

  useEffect(() => {
    const formatData = () => {
      const rows = formatExcelData(rowsData)

      setFilteredData(rows)
    }

    formatData()
  }, [rowsData, itemsData])

  return (
    <>
      <ExportExcelButton data={filteredData} />
      <DataTable
        columns={columns}
        data={itemsData}
        isMultipleDeleteEnabled
        onDataChange={(data: any) => {
          setRowsData(data)
        }}
        multipleDeleteAction={deleteMultipleItems}
      />
    </>
  )
}
