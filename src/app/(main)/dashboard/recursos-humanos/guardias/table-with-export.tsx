'use client'
import { DataTable } from '@/modules/common/components/table/data-table'
import { useEffect, useState } from 'react'

import { guardColumns } from './columns'
import { Switch } from '@/modules/common/components/switch/switch'
import { Label } from '@/modules/common/components/label/label'

export const TableWithExport = ({ data }: { data: any }) => {
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [showCompletedGuards, setShowCompletedGuards] = useState(false)
  useEffect(() => {
    const formatData = () => {
      // const rows = formatExcelData(rowsData)
      const filtered = data.filter((guard: any) => {
        if (showCompletedGuards) {
          return true
        } else {
          return guard.fecha > new Date()
        }
      })
      setFilteredData(filtered)
    }

    formatData()
  }, [data, showCompletedGuards])

  return (
    <>
      {/* <ExportExcelButton data={filteredData} /> */}
      <div className="flex items-center space-x-2">
        <Switch
          id="completed-guards"
          checked={showCompletedGuards}
          onCheckedChange={setShowCompletedGuards}
        />
        <Label htmlFor="completed-guards">Guardias Completadas</Label>
      </div>
      <DataTable
        columns={guardColumns}
        data={filteredData}
        // onDataChange={(data: any) => setFilteredData(data)}
      />
    </>
  )
}
