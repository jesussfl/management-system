'use client'
import { useState } from 'react'
import Logo from '@/modules/common/components/logo/logo'
import { SideMenuItems } from '@/modules/layout/components/side-menu-item'
import UserNav from '@/modules/common/components/user-nav/user-nav'

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div
      className={`sticky flex flex-col justify-between top-0 z-10 ${
        isOpen ? 'w-64' : 'w-[88px]'
      } p-3 min-h-screen bg-dark overflow-x-hidden  transition-all transform hideScrollbar {
        
      }`}
    >
      <div>
        <Logo isOpen={isOpen} setIsOpen={setIsOpen} />
        <SideMenuItems isOpen={isOpen} />
      </div>
      <UserNav />
    </div>
  )
}

export default SideMenu
