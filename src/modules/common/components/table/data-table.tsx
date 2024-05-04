'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  ColumnDef,
  Column,
  Table,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  RowSelectionState,
  FilterFn,
  SortingFn,
  sortingFns,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import {
  Table as TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import DataTableFilters from './data-table-filters'
import { DataTablePagination } from './data-table-pagination'
import DataTableRowsCounter from './data-table-rows-counter'
import dateBetweenFilterFn from './date-between-filter'
import dayjs from 'dayjs'
import { Input } from '../input/input'
import { format } from 'date-fns'
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
    dateBetweenFilterFn: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
interface MultipleDeleteProps {
  isMultipleDeleteEnabled: true
  multipleDeleteAction: (ids: number[]) => Promise<{
    error: boolean | null | string
    success: boolean | null | string
  }>
}

interface SingleDeleteProps {
  isMultipleDeleteEnabled?: false
  multipleDeleteAction?: null
}
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isColumnFilterEnabled?: boolean
  selectedData?: any
  setSelectedData?: (data: any) => void
  onSelectedRowsChange?: (lastSelectedRow: any) => void
} & (MultipleDeleteProps | SingleDeleteProps)

export function DataTable<TData extends { id: any }, TValue>({
  columns: tableColumns,
  data: tableData,
  isColumnFilterEnabled = true,
  onSelectedRowsChange,
  selectedData,
  setSelectedData,
  multipleDeleteAction,
  isMultipleDeleteEnabled,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [lastSelectedRow, setLastSelectedRow] = useState<any>('')
  const [filtering, setFiltering] = useState('')

  //Memoization
  const data = useMemo(() => tableData, [tableData])
  const columns = useMemo(() => tableColumns, [tableColumns])

  useEffect(() => {
    const handleSelectionState = (selections: RowSelectionState) => {
      setSelectedRows((prev) =>
        Object.keys(selections).map(
          (key) =>
            table.getSelectedRowModel().rowsById[key]?.original ||
            prev.find((row) => row.id === key)
        )
      )
    }

    handleSelectionState(selectedData || rowSelection)
  }, [selectedData || rowSelection])

  useEffect(() => {
    if (!onSelectedRowsChange) return
    onSelectedRowsChange(lastSelectedRow)
  }, [selectedRows])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
      dateBetweenFilterFn: dateBetweenFilterFn,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedData || setRowSelection,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setFiltering,

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedData || rowSelection,
      globalFilter: filtering,
    },
  })

  return (
    <div className="flex flex-col px-2 gap-2">
      {isMultipleDeleteEnabled ? (
        <DataTableFilters
          table={table}
          filtering={filtering}
          setFiltering={setFiltering}
          isColumnFilterEnabled={isColumnFilterEnabled}
          isMultipleDeleteEnabled={true}
          selectedIds={selectedRows.map((row) => row.id)}
          multipleDeleteAction={multipleDeleteAction}
        />
      ) : (
        <DataTableFilters
          table={table}
          filtering={filtering}
          setFiltering={setFiltering}
          isColumnFilterEnabled={isColumnFilterEnabled}
          isMultipleDeleteEnabled={false}
        />
      )}
      <div className="bg-background rounded-md border">
        <TableContainer>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        index === headerGroup.headers.length - 1
                          ? 'sticky right-0 top-0 bg-background'
                          : ''
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanFilter() && header.id !== 'id' ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    setLastSelectedRow(row.original)
                  }}
                  className="border-b-0"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={
                        index === row.getVisibleCells().length - 1
                          ? 'sticky right-0 top-0 bg-background'
                          : ''
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContainer>
      </div>
      <div className=" flex flex-row justify-between items-center bg-background p-5">
        <DataTableRowsCounter
          selectedRows={table.getSelectedRowModel().rows.length}
          totalRows={table.getFilteredRowModel().rows.length}
        />
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
export function isValidDate(d: any) {
  const parsedDate = new Date(d)
  return parsedDate instanceof Date && !Number.isNaN(parsedDate)
}
function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  if (firstValue instanceof Date) {
    const values = columnFilterValue as [Date, Date]
    const startDate = values?.[0]
    const endDate = values?.[1]
    return (
      <div>
        <div className="flex space-x-2">
          <Input
            type="datetime-local"
            // debounce={200}
            value={startDate ? dayjs(startDate).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => {
              const value = e.target.value
              if (
                isValidDate(value) &&
                value !== '' &&
                value !== 'Invalid Date'
              ) {
                column.setFilterValue((old: [Date, Date]) => [
                  new Date(value),
                  old?.[1],
                ])
              }
            }}
          />
          <Input
            type="datetime-local"
            // debounce={200}
            value={endDate ? dayjs(startDate).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => {
              const value = e.target.value
              if (
                isValidDate(value) &&
                value !== '' &&
                value !== 'Invalid Date'
              )
                column.setFilterValue((old: [Date, Date]) => [
                  old?.[0],
                  new Date(value),
                ])
            }}
          />
        </div>
        <div className="h-1" />
      </div>
    )
  }

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min.`}
          className="w-24 border rounded text-xs"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max.`}
          className="w-24 border rounded text-xs"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Buscar...`}
        className="w-36 border rounded text-xs"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
