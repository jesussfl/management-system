import * as React from 'react'
import { Column } from '@tanstack/react-table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/select'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()

  React.useEffect(() => {
    if (title === 'Estado') {
      column?.setFilterValue('Activos')
    }
  }, [title])
  return (
    <Select
      onValueChange={(value) => column?.setFilterValue(value)}
      defaultValue={title === 'Estado' ? 'Activos' : ''}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filtrar por:" />
      </SelectTrigger>
      <SelectContent className="max-h-56">
        {facets &&
          Array.from(facets.keys()).map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
