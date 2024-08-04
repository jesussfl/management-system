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
import { Input } from '../input/input'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { DateRange } from 'react-day-picker'

import { cn } from '@/utils/utils'
import { Button } from '@/modules/common/components/button'
import { Calendar } from '@/modules/common/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { FilterIcon } from 'lucide-react'
import { STATUS_COLUMN } from '@/modules/layout/components/status-column/indext'
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
    dateBetweenFilterFn: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}
const COLUMNS_TO_EXCLUDE = ['id', 'actions', 'detalles']
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
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  defaultSelection?: RowSelectionState
  isStatusEnabled?: boolean
  onDataChange?: (data: any[]) => void
  onSelectedRowsChange?: (
    rows: TData[],
    rowSelection: RowSelectionState,
    loading: boolean
  ) => void
} & (MultipleDeleteProps | SingleDeleteProps)

export function DataTable<TData extends { id: any }, TValue>({
  columns: tableColumns,
  data: tableData,
  onSelectedRowsChange,
  defaultSelection,
  multipleDeleteAction,
  isStatusEnabled = true,
  isMultipleDeleteEnabled,
  onDataChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    defaultSelection || {}
  )
  const [selectedRowsData, setSelectedRowsData] = useState<TData[]>([])
  const [filtering, setFiltering] = useState('')
  const [loading, setLoading] = useState<boolean>(true) // Initial loading state is true

  // Memoization
  const data = useMemo(() => tableData, [tableData])

  // Update loading state when data changes
  useEffect(() => {
    if (data.length > 0) {
      setLoading(false) // Data has loaded
    }
  }, [data])
  const columns = useMemo(() => {
    if (!isStatusEnabled) return tableColumns
    // Crear una copia de tableColumns
    const columnsCopy = [...tableColumns]
    // Insertar STATUS_COLUMN en la penúltima posición
    columnsCopy.splice(columnsCopy.length - 1, 0, STATUS_COLUMN)
    return columnsCopy
  }, [tableColumns])
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
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setFiltering,

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
    },
  })
  useEffect(() => {
    setSelectedRowsData((prev) =>
      Object.keys(rowSelection).map(
        (key) =>
          table.getSelectedRowModel().rowsById[key]?.original ||
          prev.find((row) => row.id === key)
      )
    )
  }, [rowSelection])
  const { rows } = table.getFilteredRowModel()

  useEffect(() => {
    if (!onSelectedRowsChange) return
    onSelectedRowsChange(selectedRowsData, rowSelection, loading)
  }, [selectedRowsData])

  useEffect(() => {
    if (!onDataChange) return
    onDataChange(rows)
  }, [rows])

  return (
    <div className="flex flex-col px-2 gap-2">
      {isMultipleDeleteEnabled ? (
        <DataTableFilters
          table={table}
          filtering={filtering}
          setFiltering={setFiltering}
          isColumnFilterEnabled={isStatusEnabled}
          isMultipleDeleteEnabled={true}
          selectedIds={selectedRowsData.map((row) => row.id)}
          multipleDeleteAction={multipleDeleteAction}
        />
      ) : (
        <DataTableFilters
          table={table}
          filtering={filtering}
          setFiltering={setFiltering}
          isColumnFilterEnabled={isStatusEnabled}
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
                      <div className="flex">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanFilter() &&
                        !COLUMNS_TO_EXCLUDE.includes(header.column.id) ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={
                                  header.column.getFilterValue()
                                    ? 'default'
                                    : 'ghost'
                                }
                                size="sm"
                              >
                                <FilterIcon className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <Filter
                                key={header.id}
                                column={header.column}
                                table={table}
                              />
                            </PopoverContent>
                          </Popover>
                        ) : null}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
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
                )
              })
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
  const isSomeDateValue = table
    .getPreFilteredRowModel()
    .flatRows.some((row) => row.getValue(column.id) instanceof Date)
  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  if (isSomeDateValue) {
    const date = columnFilterValue as DateRange | undefined

    return (
      <div className="flex flex-1 space-x-2">
        <div className={cn('grid gap-2')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd/MM/y')} -{' '}
                      {format(date.to, 'dd/MM/y')}
                    </>
                  ) : (
                    format(date.from, 'dd/MM/y')
                  )
                ) : (
                  <span>Seleccionar fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={column.setFilterValue}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )
  }

  return typeof firstValue === 'number' ? (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground"> Filtrar por rango </p>
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
          className="flex-1 border rounded text-xs"
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
          className="flex-1 border rounded text-xs"
        />
      </div>
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
        className="flex-1 border rounded text-xs"
        list={column.id + 'list'}
      />
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
