'use client'

import Logo from '@/modules/common/components/logo/logo'
import { SideMenuItems } from '@/modules/layout/components/side-menu-item'
const SideNav = () => {
  return (
    <div className="fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform border-r shadow-lg lg:z-auto lg:static lg:shadow-none ">
      <Logo />
      <SideMenuItems />
    </div>
  )
}

export default SideNav
