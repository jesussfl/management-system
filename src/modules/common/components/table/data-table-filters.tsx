import React from 'react'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { useToast } from '../toast/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'

interface MultipleDeleteProps {
  isMultipleDeleteEnabled: true
  selectedIds: number[]
  multipleDeleteAction: (ids: number[]) => Promise<{
    error: boolean | null | string
    success: boolean | null | string
  }>
}

interface SingleDeleteProps {
  isMultipleDeleteEnabled?: false
  selectedIds?: null
  multipleDeleteAction?: null
}

type FiltersProps = {
  table: any
  isColumnFilterEnabled: boolean
  filtering: any
  setFiltering: (filtering: any) => void
} & (MultipleDeleteProps | SingleDeleteProps)

export default function DataTableFilters({
  table,
  isColumnFilterEnabled,
  filtering,
  setFiltering,
  selectedIds,
  multipleDeleteAction,
  isMultipleDeleteEnabled,
}: FiltersProps) {
  const { toast } = useToast()

  return (
    <div className="flex flex-1 justify-between items-center py-4">
      <Input
        placeholder="Filtrar..."
        value={filtering}
        onChange={(event) => setFiltering(event.target.value)}
        // value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
        // onChange={(event) =>
        //   table.getColumn('nombre')?.setFilterValue(event.target.value)
        // }
        className="max-w-sm"
      />
      <div className="flex gap-4">
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
        {isMultipleDeleteEnabled === true && selectedIds.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="ml-auto">
                Eliminar {selectedIds.length} elementos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Deseas eliminar los elementos seleccionados?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const response = await multipleDeleteAction(selectedIds)

                    if (response.success) {
                      toast({
                        description: 'Elementos eliminados correctamente',
                        title: 'Éxito',
                        variant: 'success',
                      })
                      table.resetRowSelection()
                    }

                    if (response.error) {
                      toast({
                        description: response.error,
                        title: 'Error',
                        variant: 'destructive',
                      })
                    }
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  )
}
