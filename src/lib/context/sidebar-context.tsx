'use client'

import { isBrowser } from '@/utils/helpers/is-browser'
import { isSmallScreen } from '@/utils/helpers/is-small-screen'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useStore } from '../hooks/custom-use-store'
import { useSidebarStore } from '@/store/sidebar-store'

interface SidebarContextProps {
  isCollapsed: boolean
  setCollapsed: (isOpen: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps>(
  {} as SidebarContextProps
)

export const SidebarProvider: FC<PropsWithChildren> = function ({ children }) {
  const location = isBrowser() ? window.location.pathname : '/'
  // const storedIsCollapsed = isBrowser()
  //   ? localStorage.getItem('isSidebarCollapsed') === 'true'
  //   : false
  const store = useStore(useSidebarStore, (state) => state)
  // const [isCollapsed, setCollapsed] = useState(storedIsCollapsed)

  // Close Sidebar on page change on mobile
  useEffect(() => {
    if (isSmallScreen()) {
      store?.setCollapsed(true)
    }
  }, [location])

  // Close Sidebar on mobile tap inside main content
  useEffect(() => {
    function handleMobileTapInsideMain(event: MouseEvent) {
      const main = document.querySelector('#main-content')
      const isClickInsideMain = main?.contains(event.target as Node)

      if (isSmallScreen() && isClickInsideMain) {
        store?.setCollapsed(true)
      }
    }

    document.addEventListener('mousedown', handleMobileTapInsideMain)

    return () => {
      document.removeEventListener('mousedown', handleMobileTapInsideMain)
    }
  }, [])

  // Update local storage when collapsed state changed
  useEffect(() => {
    // localStorage.setItem('isSidebarCollapsed', isCollapsed ? 'true' : 'false')
    store?.setCollapsed(store?.isCollapsed ? true : false)
  }, [store?.isCollapsed])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed: store?.isCollapsed!,
        setCollapsed: store?.setCollapsed!,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useSidebarContext should be used within the SidebarContext provider!'
    )
  }

  return context
}
