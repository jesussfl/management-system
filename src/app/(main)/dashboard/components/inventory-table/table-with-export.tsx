'use client'
import { DataTable } from '@/modules/common/components/table/data-table'
import { useEffect, useState } from 'react'
import { showNotification } from '@/lib/actions/item'
import { RenglonWithAllRelations } from '@/types/types'
import { columns } from '../../abastecimiento/inventario/(tabs)/@tabs/columns'
import ExportExcelButton from '../items-export-button'
import { formatExcelData } from '@/lib/actions/item/format-function'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Switch } from '@/modules/common/components/switch/switch'

export const TableWithExport = ({
  itemsData,
  lowStockItems,
}: {
  itemsData: RenglonWithAllRelations[]
  lowStockItems: RenglonWithAllRelations[]
}) => {
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [isLowStockEnabled, setIsLowStockEnabled] = useState(false)
  const [rowsData, setRowsData] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    showNotification().then((res) => {
      if (lowStockItems.length > 0 && res === true) {
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
      <div className="flex items-center justify-end gap-3">
        {lowStockItems?.length > 0 && (
          <div className="flex gap-3 items-center">
            <p className="text-sm text-foreground">
              Mostrar renglones con stock bajo
            </p>
            <Switch
              disabled={lowStockItems?.length === 0}
              checked={isLowStockEnabled}
              onCheckedChange={(value) => {
                setIsLowStockEnabled(value)
              }}
            />
          </div>
        )}
        <ExportExcelButton data={filteredData} />
      </div>
      <DataTable
        columns={columns}
        data={isLowStockEnabled ? lowStockItems : itemsData}
        onDataChange={setRowsData}
      />
    </>
  )
}
