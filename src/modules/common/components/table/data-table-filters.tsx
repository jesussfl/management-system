import React from 'react'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
export default function DataTableFilters({
  table,
  isColumnFilterEnabled,
}: {
  table: any
  isColumnFilterEnabled: boolean
}) {
  return (
    <div className="flex flex-1 items-center py-4">
      <Input
        placeholder="Filtrar..."
        value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('nombre')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      {isColumnFilterEnabled && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
