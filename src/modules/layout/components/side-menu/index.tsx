'use client'
import { useState } from 'react'
import Logo from '@/modules/common/components/logo/logo'
import { SideMenuItems } from '@/modules/layout/components/side-menu-item'
import UserNav from '@/modules/common/components/user-nav/user-nav'

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <aside
        id="default-sidebar"
        aria-label="Sidebar"
        className={`sticky top-0 left-0 flex flex-col justify-between z-40 ${
          isOpen ? 'w-64' : 'w-[88px]'
        } p-3 min-h-screen bg-dark overflow-x-hidden   transition-transform -translate-x-full sm:translate-x-0`}
      >
        <div>
          <Logo isOpen={isOpen} setIsOpen={setIsOpen} />
          <SideMenuItems isOpen={isOpen} />
        </div>
        <UserNav />
      </aside>
    </>
  )
}

export default SideMenu
