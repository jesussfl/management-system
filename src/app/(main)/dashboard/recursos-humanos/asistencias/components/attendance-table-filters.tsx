'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Input } from '@/modules/common/components/input/input'
import { Search } from 'lucide-react'
import { useStore } from '@/lib/hooks/custom-use-store'
import { useAllAttendanceFilterStore } from '../lib/stores/attendance-filters-store'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'

const AttendanceFilters = () => {
  const store = useStore(useAllAttendanceFilterStore, (state) => state)

  if (!store?.currentMonth) return <div>No hay mes seleccionado</div>
  const currentMonth = new Date(store?.currentMonth)

  return (
    <div className="flex w-[70%] items-center gap-4">
      <Input
        type="text"
        placeholder="Buscar por cédula o nombre"
        value={store.searchText}
        onChange={(e) => store.handleSearchTextChange(e.target.value)}
        startIcon={Search}
      />
      <Select
        onValueChange={store?.handleMonthChange}
        defaultValue={String(currentMonth.getMonth())}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar mes" />
        </SelectTrigger>
        <SelectContent className="w-[200px]">
          <ScrollArea className="h-[200px]">
            {Array.from({ length: 12 }).map((_, index) => (
              <SelectItem key={index} value={String(index)}>
                {format(new Date(2021, index), 'MMMM', { locale: es })
                  .charAt(0)
                  .toUpperCase() +
                  format(new Date(2021, index), 'MMMM', {
                    locale: es,
                  }).slice(1)}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
      <Select
        onValueChange={store.handleYearChange}
        defaultValue={String(currentMonth.getFullYear())}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar año" />
        </SelectTrigger>
        <SelectContent className="w-[200px]">
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - i
            return (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default AttendanceFilters
