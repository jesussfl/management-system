'use client'
import { useSidebarContext } from '@/lib/context/sidebar-context'
import { CustomFlowbiteTheme, Navbar, Sidebar } from 'flowbite-react'
import { useEffect, useState, type FC } from 'react'

import { twMerge } from 'tailwind-merge'
import { SIDE_MENU_ITEMS } from '@/utils/constants/sidebar-constants'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SideMenuItem } from '@/types/types'
import { useSession } from 'next-auth/react'
import { isSmallScreen } from '@/utils/helpers/is-small-screen'
import { HiMenuAlt1, HiX } from 'react-icons/hi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { getLastAttendanceByUserId } from './recursos-humanos/asistencias/lib/actions'
import { getAttendanceTime } from '@/app/(attendance)/asistencias/lib/helpers/get-attendance-time'
import { Button } from '@/modules/common/components/button'
import UserNav from '@/modules/common/components/user-nav/user-nav'
import { UserCheckIcon } from 'lucide-react'
import { Separator } from '@/modules/common/components/separator/separator'
const customTheme: CustomFlowbiteTheme['sidebar'] = {
  root: {
    base: 'h-full',
    collapsed: {
      on: 'w-16',
      off: 'w-64',
    },
    inner:
      'h-full overflow-y-auto overflow-x-visible rounded bg-dark py-4 dark:bg-gray-800 hideScrollbar px-3 pb-20',
  },
  collapse: {
    button:
      'group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-400 transition duration-75 hover:bg-dark-secondary hover:text-white dark:text-white dark:hover:bg-gray-700',
    icon: {
      base: 'h-5 w-5 text-gray-400 transition duration-75 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white',
      open: {
        off: '',
        on: '',
      },
    },
    label: {
      base: 'ml-3 flex-1 whitespace-nowrap text-left',
      icon: {
        base: 'h-5 w-5 transition ease-in-out delay-0',
        open: {
          on: 'rotate-180 text-white',
          off: '',
        },
      },
    },
    list: 'space-y-2 py-2 ',
  },
  cta: {
    base: 'mt-6 rounded-lg p-4 bg-gray-100 dark:bg-gray-700',
    color: {
      blue: 'bg-cyan-50 dark:bg-cyan-900',
      dark: 'bg-dark-50 dark:bg-dark-900',
      failure: 'bg-red-50 dark:bg-red-900',
      gray: 'bg-alternative-50 dark:bg-alternative-900',
      green: 'bg-green-50 dark:bg-green-900',
      light: 'bg-light-50 dark:bg-light-900',
      red: 'bg-red-50 dark:bg-red-900',
      purple: 'bg-purple-50 dark:bg-purple-900',
      success: 'bg-green-50 dark:bg-green-900',
      yellow: 'bg-yellow-50 dark:bg-yellow-900',
      warning: 'bg-yellow-50 dark:bg-yellow-900',
    },
  },
  item: {
    base: 'flex items-center justify-center rounded-lg p-2 font-normal text-gray-400 hover:text-white hover:bg-dark-secondary dark:text-white dark:hover:bg-gray-700 group',
    active: 'text-white bg-primary dark:bg-gray-700',

    content: {
      base: 'px-3 flex-1 whitespace-nowrap group-hover:text-white',
    },
    icon: {
      base: 'h-5 w-5 flex-shrink-0 text-gray-400 transition duration-75 group-hover:text-white',
      active: 'text-white dark:text-white',
    },
  },
  items: {
    base: 'hover:text-white text-gray-400 dark:text-gray-400',
  },
  itemGroup: {
    base: 'mt-4 space-y-2 border-t border-gray-200 pt-4 text-gray-400 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700',
  },
  logo: {
    base: 'mb-5 flex items-center pl-2.5',
    collapsed: {
      on: 'hidden',
      off: 'self-center whitespace-nowrap text-xl font-semibold dark:text-white',
    },
    img: 'mr-3 h-6 sm:h-7',
  },
}

export const DashboardSidebar: FC = function () {
  const { isCollapsed, setCollapsed: setSidebarCollapsed } = useSidebarContext()

  const pathname = usePathname()
  const { data: session } = useSession()
  const { user } = session || {}
  const { rol } = user || {}
  const permissions = rol?.permisos
  // const user = useCurrentUser()
  const [inTime, setInTime] = useState<string>('')
  const [outTime, setOutTime] = useState<string>('')

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
  const userSections = permissions?.map(
    (permission) => permission.permiso_key.split(':')[0]
  )

  const filterMenuItems = (items: SideMenuItem[]) => {
    return items.filter((item) => {
      if (item.requiredPermissions) {
        // Verificar si el usuario tiene al menos uno de los permisos requeridos
        return item.requiredPermissions.some(
          (section) => userSections?.includes(section)
        )
      } else {
        // Si no hay permisos requeridos, mostrar el elemento
        return true
      }
    })
  }

  // Filtrar los elementos principales del menú lateral
  const filteredMenuItems = filterMenuItems(SIDE_MENU_ITEMS)

  const filteredSubmenuItems = filteredMenuItems.map((item) => {
    if (item.submenu && item.submenuItems) {
      return {
        ...item,
        submenuItems: filterMenuItems(item.submenuItems),
      }
    }
    return item
  })

  const menuItems = filteredSubmenuItems.filter((item) => {
    if (item.submenu && item.submenuItems) {
      if (item.submenuItems.length === 0) return false
    }

    return true
  })

  const isActivePath = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      id="sidebar"
      theme={customTheme}
      className={twMerge(
        'fixed inset-y-0 left-0 z-20 mt-0 bg-dark flex h-full shrink-0 flex-col duration-75 lg:flex',
        isCollapsed && 'hidden w-16'
      )}
    >
      <div className="flex items-center my-4">
        <Button
          aria-controls="sidebar"
          aria-expanded
          variant={'ghost'}
          className="mr-2 cursor-pointer rounded p-2 text-gray-200 "
          onClick={() => setSidebarCollapsed(!isCollapsed)}
        >
          {isCollapsed || !isSmallScreen() ? (
            <HiMenuAlt1 className="h-6 w-6" />
          ) : (
            <HiX className="h-6 w-6" />
          )}
        </Button>
        {/* <Navbar.Brand href="/"> */}
        <span className="self-center whitespace-nowrap px-3 text-white tex-sm md:text-xl font-semibold dark:text-white">
          SIGECAI
        </span>
        {/* </Navbar.Brand> */}
      </div>
      <Separator className="my-4" />
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {menuItems.map((item, idx) => {
            if (item.submenu) {
              return (
                <Sidebar.Collapse
                  className={`${
                    isActivePath(item.path)
                      ? 'text-white bg-dark-secondary'
                      : ''
                  }`}
                  key={idx}
                  label={item.title}
                  icon={item.icon}
                  open={isActivePath(item.path)}
                >
                  <div className={`bg-[#262627] rounded-md flex gap-4`}>
                    <div
                      className={`flex-1 space-y-2 ${
                        isCollapsed ? 'ml-[2px]' : 'p-2'
                      } rounded-sm`}
                    >
                      {item.submenuItems?.map((subItem, subIdx) => {
                        return (
                          <Sidebar.Item
                            as={Link}
                            key={subIdx}
                            href={subItem.path}
                            icon={subItem.icon}
                            active={isActivePath(subItem.path)}
                          >
                            <p
                              className={
                                isActivePath(subItem.path) ? 'text-white' : ''
                              }
                            >
                              {subItem.title}
                            </p>
                          </Sidebar.Item>
                        )
                      })}
                    </div>
                  </div>
                </Sidebar.Collapse>
              )
            }

            if (item.path === '/dashboard') {
              return (
                <Sidebar.Item
                  as={Link}
                  key={idx}
                  href={item.path}
                  icon={item.icon}
                  active={pathname === item.path}
                >
                  <p className={pathname === item.path ? 'text-white' : ''}>
                    {item.title}
                  </p>
                </Sidebar.Item>
              )
            }

            return (
              <Sidebar.Item
                as={Link}
                key={idx}
                href={item.path}
                icon={item.icon}
                active={isActivePath(item.path)}
              >
                <p className={isActivePath(item.path) ? 'text-white' : ''}>
                  {item.title}
                </p>
              </Sidebar.Item>
            )
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      <div
        className={`fixed bg-dark ${
          isCollapsed ? 'w-16 p-2' : 'w-64 p-4'
        } bottom-0 left-0 `}
      >
        <div
          className={`flex flex-col ${
            isCollapsed ? 'gap-2' : 'gap-4'
          } py-2 bg-[#262627] border-[#49494b] border rounded-md`}
        >
          <UserNav />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                className={`flex ${
                  isCollapsed ? 'justify-center text-xl' : ''
                } justify-start gap-2 text-white`}
              >
                <UserCheckIcon
                  className={isCollapsed ? 'h-8 w-8' : 'h-5 w-5'}
                />
                {isCollapsed ? '' : 'Ver mi asistencia'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[70vw] md:w-60"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-lg md:text-sm font-medium leading-none">
                  {`Hora de entrada: ${inTime} `}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal">
                <p className="text-lg md:text-sm font-medium leading-none">
                  {`Hora de salida: ${outTime}`}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Sidebar>
  )
}
