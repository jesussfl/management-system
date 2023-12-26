'use client'

import Logo from '@/modules/common/components/logo/logo'
import { SideMenuItems } from '@/modules/layout/components/side-menu-item'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'

const SideMenu = () => {
  return (
    <ScrollArea className="fixed z-10 flex flex-col flex-shrink-0 w-60 p-4 max-h-screen overflow-hidden transition-all transform border-r shadow-lg lg:z-auto lg:static lg:shadow-none">
      <Logo />
      <SideMenuItems />
    </ScrollArea>
  )
}

export default SideMenu
