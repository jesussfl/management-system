'use client'

import Logo from '@/components/ui/logo'
import { Separator } from '@/components/ui/separator'
import { SidenavItems } from '@/components/ui/side-nav-item'
import SidenavAvatar from './side-nav-avatar'
const SideNav = () => {
  return (
    <div className="md:flex flex-col w-full gap-2 hidden h-screen  flex-1 border-r bg-background">
      <Logo />
      <Separator />
      <SidenavItems />
      <Separator />
      <SidenavAvatar />
    </div>
  )
}

export default SideNav
