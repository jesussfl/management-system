'use client'

import {
  SidebarProvider,
  useSidebarContext,
} from '@/lib/context/sidebar-context'
import type { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { DashboardNavbar } from './navbar'
import { DashboardSidebar } from './sidebar'
import { PageTemplate } from '@/modules/layout/templates/page'

const DashboardLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}

const DashboardLayoutContent: FC<PropsWithChildren> = function ({ children }) {
  const { isCollapsed } = useSidebarContext()

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
