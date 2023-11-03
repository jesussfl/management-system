import React from 'react'

export default function DataTableRowsCounter({
  selectedRows,
  totalRows,
}: {
  selectedRows: number
  totalRows: number
}) {
  return (
    <div className=" text-sm text-muted-foreground">
      {selectedRows} of {totalRows} row(s) selected.
    </div>
  )
}
