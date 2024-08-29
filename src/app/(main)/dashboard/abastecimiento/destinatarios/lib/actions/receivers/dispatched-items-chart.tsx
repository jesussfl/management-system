'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/modules/common/components/chart'
import { Renglon } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  DateRange,
  DispatchesByReceiver,
  getDispatchesByReceiver,
} from '../../../../../../../../lib/actions/dispatch/stats'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Button } from '@/modules/common/components/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Label } from '@/modules/common/components/label/label'

interface DateRangePickerProps {
  onDateChange: (dates: DateRange) => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start || undefined)
    setEndDate(end || undefined)
    onDateChange({ from: start, to: end }) // Pass dates back to parent
  }

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      isClearable={true}
      withPortal
      showMonthDropdown
      locale={'es'}
      showYearDropdown
      placeholderText="Selecciona un rango de fecha"
      className="border-1 w-[250px] rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  )
}

export default DateRangePicker

type ItemsChartProps<T> = {
  dataFetcher: (params: {
    id: number
    dateRange: DateRange
    dispatchType?: string
  }) => Promise<T[]>
  id: number
  chartTitle: string
  chartDescription: string
  dispatchType?: string
  color?: string
}

const chartConfig = {
  item: {
    label: 'Item',
    color: '#2b6cb0',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig

export function ItemsChart<T>({
  dataFetcher,
  id,
  chartTitle,
  chartDescription,
  dispatchType,
  color,
}: ItemsChartProps<T>) {
  const [dates, setDates] = useState<DateRange>({ from: null, to: null })
  const [items, setItems] = useState<T[]>([])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleDateChange = (dates: DateRange) => {
    setDates(dates)
  }

  useEffect(() => {
    dataFetcher({
      id,
      dateRange: dates,
      dispatchType,
    }).then((data) => setItems(data))
  }, [dates, id, dispatchType, dataFetcher])

  // Calculate paginated data
  const indexOfLastItem = currentPage * rowsPerPage
  const indexOfFirstItem = indexOfLastItem - rowsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)

  // Pagination Controls
  const totalPages = Math.ceil(items.length / rowsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1) // Reset to page 1 when rows per page change
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DateRangePicker onDateChange={handleDateChange} />

        {/* Rows per page selector */}
        <div className="flex items-center justify-between"></div>

        {/* Display Chart */}
        <ChartContainer
          config={{
            item: {
              label: chartConfig.item.label,
              color,
            },
            label: chartConfig.label,
          }}
        >
          <BarChart
            accessibilityLayer
            data={currentItems} // Use paginated data here
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="itemData.nombre"
              type="category"
              tickLine={true}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="totalQuantity" type="number" hide />
            <ChartTooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="totalQuantity"
              layout="vertical"
              fill="var(--color-item)"
              radius={4}
            >
              <LabelList
                dataKey="itemData.nombre"
                position="insideLeft"
                offset={8}
                fontSize={12}
                className="fill-[--color-label] font-bold"
              />
              <LabelList
                dataKey="totalQuantity"
                position="right"
                offset={8}
                fontSize={14}
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-row items-start justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Label>Filas:</Label>
          <Select
            onValueChange={(value) => setRowsPerPage(Number(value))}
            defaultValue={String(rowsPerPage)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'5'}>5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant={'outline'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>
            {currentPage}/{totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant={'outline'}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  console.log(payload, 'payload')
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip rounded-sm bg-background p-2 shadow-md">
        <p className="font-bold">{`${payload[0].payload.itemData.numero_parte}`}</p>
        <p className="label">{`${payload[0].payload.itemData.descripcion}`}</p>
      </div>
    )
  }

  return null
}
