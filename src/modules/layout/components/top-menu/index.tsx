'use client'

import React from 'react'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

import useScroll from '@/hooks/use-scroll'
import { cn } from '@/lib/utils'
import { Search } from '@/modules/common/components/search/search'
import { UserNav } from '@/modules/common/components/user-nav'
import ToogleTheme from '@/components/ui/toogle-theme'

const Header = () => {
  const scrolled = useScroll(5)
  const selectedLayout = useSelectedLayoutSegment()

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b bg-background`,
        {
          'border-b border-border bg-white/75 backdrop-blur-lg': scrolled,
          'border-b border-border bg-background': selectedLayout,
        }
      )}
    >
      <div className="flex h-[56px] items-center justify-between px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ToogleTheme />
          <Search />
          <UserNav />
        </div>
      </div>
    </div>
  )
}

export default Header
