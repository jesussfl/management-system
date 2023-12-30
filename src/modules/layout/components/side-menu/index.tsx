'use client'
import { useState } from 'react'
import Logo from '@/modules/common/components/logo/logo'
import { SideMenuItems } from '@/modules/layout/components/side-menu-item'

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      className={`sticky top-0 z-10 ${
        isOpen ? 'w-64' : 'w-[88px]'
      } p-3 min-h-screen bg-dark overflow-x-hidden  transition-all transform hideScrollbar {
        
      }`}
    >
      <Logo isOpen={isOpen} setIsOpen={setIsOpen} />
      <SideMenuItems isOpen={isOpen} />
    </div>
  )
}

export default SideMenu
