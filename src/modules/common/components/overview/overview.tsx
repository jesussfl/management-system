'use client'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useState } from 'react'
import * as React from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/utils/utils'
import { Button } from '@/modules/common/components/button'
import { Calendar } from '@/modules/common/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { getDispatchesStats } from '@/app/(main)/dashboard/lib/actions/statistics'
import { Card, CardContent, CardHeader, CardTitle } from '../card/card'
const months = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as string[]
export function Overview({}: {}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  })

  const [filteredData, setFilteredData] = useState<any>()

  React.useEffect(() => {
    getDispatchesStats({ from: date?.from, to: date?.to }).then((res) => {
      const dispatchCountsByMonth = {} as Record<string, number>
      // Inicializar userCountsByMonth con 0 para cada mes
      months.forEach((month) => {
        dispatchCountsByMonth[month] = 0
      })
      // Contar el número de usuarios registrados en cada mes
      res.forEach((dispatch) => {
        const createdAt = new Date(dispatch.fecha_creacion)
        const monthIndex = createdAt.getMonth()
        const monthName = months[monthIndex]
        dispatchCountsByMonth[monthName]++
      })
      // Convertir userCountsByMonth a un array de objetos con la estructura { name: string, total: number }
      const data = Object.entries(dispatchCountsByMonth).map(
        ([name, total]) => ({
          name,
          total,
        })
      )
      setFilteredData(data)
    })
  }, [date])
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resumen</CardTitle>
        <div className={cn('grid gap-2')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={filteredData} barSize={20}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 20]}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
