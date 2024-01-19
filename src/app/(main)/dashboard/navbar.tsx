import { useSidebarContext } from '@/lib/context/sidebar-context'
import UserNav from '@/modules/common/components/user-nav/user-nav'
import { isSmallScreen } from '@/utils/helpers/is-small-screen'
import { Navbar } from 'flowbite-react'
import type { FC } from 'react'
import { HiMenuAlt1, HiX } from 'react-icons/hi'

export const DashboardNavbar: FC<Record<string, never>> = function () {
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useSidebarContext()

  return (
    <header>
      <Navbar fluid className="fixed top-0 z-30 w-full bg-dark p-0 sm:p-0">
        <div className="w-full p-3 pr-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                aria-controls="sidebar"
                aria-expanded
                className="mr-2 cursor-pointer rounded p-2 text-gray-200 hover:bg-dark-secondary hover:text-gray-900 focus:ring-2 focus:bg-dark ring-dark"
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

            <UserNav />
          </div>
        </div>
      </Navbar>
    </header>
  )
}
