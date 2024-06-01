// components/AttendanceTable.tsx
'use client'
// components/AttendanceTable.tsx
import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Prisma } from '@prisma/client'
import { Input } from '@/modules/common/components/input/input'
import { Search } from 'lucide-react'

type UserWithAttendances = Prisma.UsuarioGetPayload<{
  include: {
    asistencias: true
    personal: true
  }
}>

interface AttendanceTableProps {
  user: UserWithAttendances
}

const AttendanceTableByUser: React.FC<AttendanceTableProps> = ({ user }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [selectedYear, setSelectedYear] = useState<number>(
    currentMonth.getFullYear()
  )

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const handleMonthChange = (value: string) => {
    const newMonth = new Date(currentMonth.setMonth(parseInt(value)))
    setCurrentMonth(newMonth)
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setSelectedYear(newYear)
    const newMonth = new Date(currentMonth.setFullYear(newYear))
    setCurrentMonth(newMonth)
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-4">
        {format(currentMonth, 'MMMM yyyy', { locale: es })}
      </h1>
      <div className="flex justify-start items-center gap-4">
        <Select
          onValueChange={handleMonthChange}
          defaultValue={String(currentMonth.getMonth())}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, index) => (
              <SelectItem key={index} value={String(index)}>
                {format(new Date(2021, index), 'MMMM', { locale: es })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={handleYearChange}
          defaultValue={String(currentMonth.getFullYear())}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar año" />
          </SelectTrigger>
          <SelectContent>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Personal</TableHead>
            {daysInMonth.map((day) => (
              <TableHead key={day.toString()}>{format(day, 'd')}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={user.id}>
            <TableCell
              style={{
                display: 'flex',
                width: '200px',
              }}
            >{`${user.personal?.nombres} ${user.personal?.apellidos} ${user.tipo_cedula}-${user.cedula}`}</TableCell>
            {daysInMonth.map((day) => {
              const attendance = user.asistencias.find(
                (record) =>
                  record.hora_entrada &&
                  format(record.hora_entrada, 'yyyy-MM-dd') ===
                    format(day, 'yyyy-MM-dd')
              )

              let cellColor: string
              if (!attendance) {
                cellColor = '#F5BDB6'
              } else if (attendance.hora_entrada && attendance.hora_salida) {
                cellColor = '#B8F5B6'
              } else {
                cellColor = '#F5EEB6'
              }

              return (
                <TableCell
                  key={day.toString()}
                  style={{ backgroundColor: cellColor }}
                  className="text-center text-xs"
                >
                  {attendance ? (
                    <div>
                      <div>
                        Entrada:{' '}
                        {attendance.hora_entrada
                          ? format(attendance.hora_entrada, 'HH:mm')
                          : 'N/A'}
                      </div>
                      <div>
                        Salida:{' '}
                        {attendance.hora_salida
                          ? format(attendance.hora_salida, 'HH:mm')
                          : 'N/A'}
                      </div>
                    </div>
                  ) : (
                    'S/A'
                  )}
                </TableCell>
              )
            })}
          </TableRow>
          {/* {filteredUsers.map((user) => (
          ))} */}
        </TableBody>
      </Table>
    </div>
  )
}

export default AttendanceTableByUser
