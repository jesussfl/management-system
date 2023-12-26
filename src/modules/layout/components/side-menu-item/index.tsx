'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SIDE_MENU_ITEMS } from '@/utils/constants/side-menu-items'
import { SideMenuItem } from '@/types/types'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/modules/common/components/button'
import Link from 'next/link'

export const SideMenuItems = () => {
  return (
    <div className="flex flex-col space-y-1 ">
      {SIDE_MENU_ITEMS.map((item, idx) => {
        return <MenuItem key={idx} item={item} />
      })}
    </div>
  )
}

const MenuItem = ({ item }: { item: SideMenuItem }) => {
  const pathname = usePathname()
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen)
  }
  const isActive = item.path === pathname

  if (item.submenu) {
    return (
      <>
        <Button
          onClick={toggleSubMenu}
          variant={isActive ? 'secondary' : 'ghost'}
          className={`w-full justify-between flex gap-2 items-center text-sm ${
            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          <div className={`flex justify-start gap-2 items-center `}>
            {item.icon}

            {item.title}
          </div>

          <ChevronDown
            size="18"
            className={`${subMenuOpen ? 'rotate-180' : ''} `}
          />
        </Button>

        {subMenuOpen && (
          <div className="my-2 ml-5 flex flex-col space-y-2">
            {item.submenuItems?.map((subItem, idx) => {
              return (
                <Link key={idx} href={subItem.path}>
                  <Button
                    variant={subItem.path === pathname ? 'default' : 'ghost'}
                    className={`w-full text-sm justify-start flex gap-2 ${
                      subItem.path === pathname
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    } `}
                  >
                    {subItem.icon}
                    {subItem.title}
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </>
    )
  }
  return (
    <div>
      <Link href={item.path}>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className={`flex text-sm w-full justify-start gap-2 ${
            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
          } `}
        >
          {item.icon}
          {item.title}
        </Button>
      </Link>
    </div>
  )
}
