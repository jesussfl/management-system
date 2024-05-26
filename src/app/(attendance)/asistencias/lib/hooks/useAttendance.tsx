'use client'
import { getLastAttendanceByUserId } from '@/app/(main)/dashboard/recursos-humanos/asistencias/lib/actions'

import { getAttendanceTime } from '../helpers/get-attendance-time'
import { useEffect, useState } from 'react'
export default function useAttendance(userId: string) {
  // const lastAttendance = getLastAttendanceByUserId(userId)
  const [lastAttendance, setLastAttendance] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLastAttendance = async () => {
      setIsLoading(true)
      const lastAttendance = await getLastAttendanceByUserId(userId)
      setLastAttendance(lastAttendance)
      setIsLoading(false)
    }
    fetchLastAttendance()
  }, [userId])

  const inTime = lastAttendance?.hora_entrada
    ? getAttendanceTime(lastAttendance?.hora_entrada)
    : 'Sin registrar'

  const outTime = lastAttendance?.hora_salida
    ? getAttendanceTime(lastAttendance?.hora_salida)
    : 'Sin registrar'

  return {
    inTime,
    outTime,
    isLoading,
  }
}
