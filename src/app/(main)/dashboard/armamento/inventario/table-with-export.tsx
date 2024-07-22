'use client'
import { DataTable } from '@/modules/common/components/table/data-table'
import { useEffect, useState } from 'react'
import { deleteMultipleItems, showNotification } from './lib/actions/items'
import { RenglonWithAllRelations } from '@/types/types'
import { columns } from './columns'
import ExportExcelButton from './components/items-export-button'
import { formatExcelData } from './format-function'
import { useToast } from '@/modules/common/components/toast/use-toast'

export const TableWithExport = ({
  itemsData,
  lowStockItems,
}: {
  itemsData: RenglonWithAllRelations[]
  lowStockItems?: RenglonWithAllRelations[]
}) => {
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [rowsData, setRowsData] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    showNotification().then((res) => {
      if (lowStockItems && res === true) {
        const lowStockItemsNames = lowStockItems.map((item) => item.nombre)
        if (lowStockItemsNames.length < 6) {
          toast({
            title: 'Hay renglones con stock bajo',
            variant: 'info',
            description: `Los siguientes renglones tienen stock bajo: ${lowStockItemsNames
              .slice(0, 6)
              .join(', ')}`,
          })
        }
        toast({
          title: 'Hay renglones con stock bajo',
          variant: 'info',
          description: `Hay ${lowStockItems.length} renglones que están por debajo del stock minimo`,
        })
      }
    })
  }, [lowStockItems, toast])
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
