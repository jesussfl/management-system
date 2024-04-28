'use client'
import { useSidebarContext } from '@/lib/context/sidebar-context'
import { CustomFlowbiteTheme, Sidebar } from 'flowbite-react'
import { useEffect, useState, type FC } from 'react'

import { twMerge } from 'tailwind-merge'
import { SIDE_MENU_ITEMS } from '@/utils/constants/sidebar-constants'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getUserPermissions } from '@/lib/auth'
import { Permiso } from '@prisma/client'
import { SideMenuItem } from '@/types/types'

const customTheme: CustomFlowbiteTheme['sidebar'] = {
  root: {
    base: 'h-full',
    collapsed: {
      on: 'w-16',
      off: 'w-64',
    },
    inner:
      'h-full overflow-y-auto rounded bg-dark py-4 px-3 dark:bg-gray-800 hideScrollbar',
  },
  collapse: {
    button:
      'group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-500 transition duration-75 hover:bg-dark-secondary hover:text-white dark:text-white dark:hover:bg-gray-700',
    icon: {
      base: 'h-6 w-6 text-gray-500 transition duration-75 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white',
      open: {
        off: '',
        on: '',
      },
    },
    label: {
      base: 'ml-3 flex-1 whitespace-nowrap text-left',
      icon: {
        base: 'h-6 w-6 transition ease-in-out delay-0',
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
    base: 'flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-500 hover:text-white hover:bg-dark-secondary dark:text-white dark:hover:bg-gray-700',
    active: 'bg-primary dark:bg-gray-700',

    content: {
      base: 'px-3 flex-1 whitespace-nowrap',
    },
    icon: {
      base: 'h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-white',
      active: 'text-white dark:text-gray-100',
    },
    label: '',
    listItem: '',
  },
  items: {
    base: '',
  },
  itemGroup: {
    base: 'mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700',
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

type UserPermissions = {
  id: number
  permiso_key: string
  rol_nombre: string
  active: boolean | null
}[]
export const DashboardSidebar: FC = function () {
  const { isCollapsed } = useSidebarContext()
  const pathname = usePathname()
  const [permissions, setPermissions] = useState<UserPermissions>([])

  useEffect(() => {
    const fetchedPermissions = async () => {
      const permissions = await getUserPermissions()
      if (!permissions) {
        return
      }
      setPermissions(permissions)
    }

    fetchedPermissions()
  }, [])
  const userSections = permissions?.map(
    (permission) => permission.permiso_key.split(':')[0]
  )
  // Filtrar los elementos del menú lateral que coinciden con la sección del usuario
  const userPermissions = permissions?.map(
    (permission) => permission.permiso_key
  )

  const filterMenuItems = (items: SideMenuItem[]) => {
    return items.filter((item) => {
      if (item.requiredPermissions) {
        // Verificar si el usuario tiene al menos uno de los permisos requeridos
        return item.requiredPermissions.some(
          (permission) => userSections?.includes(permission)
        )
      } else {
        // Si no hay permisos requeridos, mostrar el elemento
        return true
      }
    })
  }

  // Filtrar los elementos principales del menú lateral
  const filteredMenuItems = filterMenuItems(SIDE_MENU_ITEMS)

  // Filtrar las subsecciones de los elementos principales del menú lateral
  filteredMenuItems.forEach((item) => {
    if (item.submenu && item.submenuItems) {
      item.submenuItems = filterMenuItems(item.submenuItems)
    }
  })

  const menuItems = filteredMenuItems.filter((item) => {
    if (item.submenu && item.submenuItems) {
      if (item.submenuItems.length === 0) return false
    }

    return true
  })

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      id="sidebar"
      theme={customTheme}
      className={twMerge(
        'fixed inset-y-0 left-0 z-20 mt-16 bg-dark flex h-full shrink-0 flex-col duration-75 lg:flex',
        isCollapsed && 'hidden w-16'
      )}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup title="Main">
          {menuItems.map((item, idx) => {
            if (item.submenu) {
              return (
                <Sidebar.Collapse
                  className={`${
                    pathname.split('/').slice(0, -1).join('/') === item.path
                      ? 'text-white bg-dark-secondary'
                      : ''
                  }`}
                  key={idx}
                  label={item.title}
                  icon={item.icon}
                >
                  {item.submenuItems?.map((subItem, subIdx) => {
                    return (
                      <Sidebar.Item
                        // use button variants for as
                        as={Link}
                        key={subIdx}
                        href={subItem.path}
                        icon={subItem.icon}
                        active={subItem.path === pathname}
                      >
                        <p
                          className={
                            subItem.path === pathname ? 'text-white' : ''
                          }
                        >
                          {subItem.title}
                        </p>
                      </Sidebar.Item>
                    )
                  })}
                </Sidebar.Collapse>
              )
            }
            return (
              <Sidebar.Item
                as={Link}
                key={idx}
                href={item.path}
                icon={item.icon}
                active={item.path === pathname}
              >
                <p className={item.path === pathname ? 'text-white' : ''}>
                  {item.title}
                </p>
              </Sidebar.Item>
            )
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
