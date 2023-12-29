'use client'
import { useState } from 'react'
import Logo from '@/modules/common/components/logo/logo'
import { SideMenuItems } from '@/modules/layout/components/side-menu-item'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'
import { Button } from '@/modules/common/components/button'

const SideMenu = () => {
  // TODO: fix responsive when open is false
  const [open, setOpen] = useState(false)
  return (
    <ScrollArea
      className={`fixed z-10 flex flex-col flex-shrink-0 ${
        open ? 'w-64' : 'w-16'
      } p-4 max-h-screen overflow-hidden transition-all transform border-r shadow-lg lg:z-auto lg:static lg:shadow-none`}
    >
      <Button onClick={() => setOpen(!open)}>Open</Button>
      <Logo />
      <SideMenuItems />
    </ScrollArea>
  )
}

export default SideMenu
