'use client'

import {
  SidebarProvider,
  useSidebarContext,
} from '@/lib/context/sidebar-context'
import { useEffect, useState, type FC, type PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { DashboardNavbar } from './navbar'
import { DashboardSidebar } from './sidebar'
import { PageTemplate } from '@/modules/layout/templates/page'
import {
  createAttendance,
  getAttendancesByUserId,
} from './recursos-humanos/asistencias/lib/actions'
import { auth } from '@/auth'
import { isSameDay } from 'date-fns'
import { useCurrentUser } from '@/lib/hooks/use-current-user'

const DashboardLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}

const DashboardLayoutContent: FC<PropsWithChildren> = function ({ children }) {
  const { isCollapsed } = useSidebarContext()
  // const user = useCurrentUser()

  // useEffect(() => {
  //   const checkAttendance = async () => {
  //     console.log('checkAttendance')

  //     if (!user || !user.id) return
  //     console.log('has user', user)

  //     // Obtener las asistencias del usuario para el día de hoy
  //     const today = new Date()
  //     const attendances = await getAttendancesByUserId(user.id)
  //     const todayAttendance = attendances.find((attendance) =>
  //       isSameDay(new Date(attendance.fecha_realizado), today)
  //     )
  //     console.log('todayAttendance', todayAttendance)
  //     // Si no hay asistencia para hoy, crear un nuevo registro
  //     if (!todayAttendance) {
  //       console.log('No hay asistencia para hoy')
  //       await createAttendance({ id_usuario: user.id })
  //       // Opcional: mostrar una notificación o realizar alguna acción adicional
  //     }
  //   }

  //   checkAttendance()
  // }, [user])
  return (
    <>
      <DashboardNavbar />
      <div className="flex items-start">
        <DashboardSidebar />
        <div
          id="main-content"
          className={twMerge(
            'relative w-full h-screen pt-16 rounded-sm overflow-hidden bg-dark dark:bg-gray-900',
            isCollapsed ? 'lg:ml-[4rem]' : 'lg:ml-64'
          )}
        >
          <PageTemplate>{children}</PageTemplate>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
