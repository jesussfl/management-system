import React from 'react'

export default function DataTableRowsCounter({
  selectedRows,
  totalRows,
}: {
  selectedRows: number
  totalRows: number
}) {
  return (
    <div className=" text-xs text-muted-foreground">
      {selectedRows} de {totalRows} filas(s) seleccionadas.
    </div>
  )
}
