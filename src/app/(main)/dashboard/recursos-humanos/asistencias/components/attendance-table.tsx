'use client'

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
import { Prisma } from '@prisma/client'
import { useStore } from '@/lib/hooks/custom-use-store'
import { useAllAttendanceFilterStore } from '../lib/stores/attendance-filters-store'
import AttendanceFilters from './attendance-table-filters'

type UserWithAttendances = Prisma.UsuarioGetPayload<{
  include: {
    asistencias: true
    personal: true
  }
}>

type MultipleUsersTableProps = {
  user?: undefined
  users: UserWithAttendances[]
}

type SingleUserTableProps = {
  users?: undefined
  user: UserWithAttendances
}

type AttendanceTableProps = MultipleUsersTableProps | SingleUserTableProps

const AttendanceTable: React.FC<AttendanceTableProps> = ({ users, user }) => {
  const store = useStore(useAllAttendanceFilterStore, (state) => state)

  if (!store?.currentMonth) return <div>No hay mes seleccionado</div>
  const currentMonth = new Date(store?.currentMonth)

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const filteredUsers =
    users &&
    users.filter((user) => {
      const fullName = user.personal
        ? `${user.personal?.nombres} ${user.personal?.apellidos}`
        : user.nombre
      const isMatchingName = fullName
        .toLowerCase()
        .includes(store.searchText.toLowerCase())
      const isnMatchingCed = user.cedula
        .toLowerCase()
        .includes(store.searchText.toLowerCase())

      return isMatchingName || isnMatchingCed
    })

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-4">
        {format(currentMonth, 'MMMM yyyy', { locale: es })
          .charAt(0)
          .toUpperCase() +
          format(currentMonth, 'MMMM yyyy', { locale: es }).slice(1)}
      </h1>

      <AttendanceFilters />

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
          {!user && filteredUsers ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell
                  style={{
                    display: 'flex',
                    width: '200px',
                  }}
                >
                  {user.personal
                    ? `${user.personal?.nombres} ${user.personal?.apellidos}`
                    : user.nombre}

                  {` ${user.tipo_cedula}-${user.cedula}`}
                </TableCell>
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
                  } else if (
                    attendance.hora_entrada &&
                    attendance.hora_salida
                  ) {
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
            ))
          ) : (
            <TableRow key={user?.id}>
              <TableCell
                style={{
                  display: 'flex',
                  width: '200px',
                }}
              >
                {' '}
                {user?.personal
                  ? `${user.personal?.nombres} ${user.personal?.apellidos}`
                  : user?.nombre}
                {` ${user?.tipo_cedula}-${user?.cedula}`}
              </TableCell>
              {daysInMonth.map((day) => {
                const attendance = user?.asistencias.find(
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
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AttendanceTable
