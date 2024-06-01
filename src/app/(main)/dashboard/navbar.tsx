import { useSidebarContext } from '@/lib/context/sidebar-context'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { buttonVariants } from '@/modules/common/components/button'
import UserNav from '@/modules/common/components/user-nav/user-nav'
import { isSmallScreen } from '@/utils/helpers/is-small-screen'
import { cn } from '@/utils/utils'
import { Navbar } from 'flowbite-react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type FC } from 'react'
import { HiMenuAlt1, HiX } from 'react-icons/hi'
import { getLastAttendanceByUserId } from './recursos-humanos/asistencias/lib/actions'
import { getAttendanceTime } from '@/app/(attendance)/asistencias/lib/helpers/get-attendance-time'

export const DashboardNavbar: FC<Record<string, never>> = function () {
  const user = useCurrentUser()
  const [inTime, setInTime] = useState<string>('')
  const [outTime, setOutTime] = useState<string>('')
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useSidebarContext()

  useEffect(() => {
    if (!user) return
    getLastAttendanceByUserId(user?.id).then((attendance) => {
      const inTime = attendance?.hora_entrada
        ? getAttendanceTime(attendance?.hora_entrada)
        : 'Sin registrar'

      const outTime = attendance?.hora_salida
        ? getAttendanceTime(attendance?.hora_salida)
        : 'Sin registrar'

      setInTime(inTime)
      setOutTime(outTime)
    })
  }, [])
  return (
    <header>
      <Navbar fluid className="fixed top-0 z-30 w-full bg-dark p-0 sm:p-0">
        <div className="w-full p-3 pr-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                aria-controls="sidebar"
                aria-expanded
                className="mr-2 cursor-pointer rounded p-2 text-gray-200 "
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed || !isSmallScreen() ? (
                  <HiMenuAlt1 className="h-6 w-6" />
                ) : (
                  <HiX className="h-6 w-6" />
                )}
              </button>
              <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap px-3 text-white text-xl font-semibold dark:text-white">
                  Administrador
                </span>
              </Navbar.Brand>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-white text-xs">
                Tu Hora de entrada: {inTime} - Tu Hora de salida: {outTime}
              </p>
              <Link
                href="/asistencias"
                className={cn(
                  buttonVariants({ variant: 'link', size: 'sm' }),
                  'text-white'
                )}
              >
                Ir al Control de Asistencias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </Navbar>
    </header>
  )
}
