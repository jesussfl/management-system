'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SIDE_MENU_ITEMS } from '@/utils/constants/sidebar-constants'
import { SideMenuItem } from '@/types/types'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/modules/common/components/button'
import Link from 'next/link'

export const SideMenuItems = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className={`flex flex-col w-full space-y-1 items-stretch`}>
      {SIDE_MENU_ITEMS.map((item, idx) => {
        return <MenuItem key={idx} item={item} isOpen={isOpen} />
      })}
    </div>
  )
}

const MenuItem = ({
  item,
  isOpen,
}: {
  item: SideMenuItem
  isOpen: boolean
}) => {
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
          variant={subMenuOpen ? 'secondary' : 'ghost'}
          className={`w-full hover:bg-dark-secondary hover:text-white ${
            isOpen ? 'justify-between' : 'justify-center'
          }  flex gap-2 items-center  ${
            subMenuOpen ? 'text-white bg-dark-secondary' : 'text-dark-muted'
          }`}
        >
          <div
            className={`flex justify-start  ${isOpen && 'gap-2'} items-center `}
          >
            {item.icon}
            {!isOpen && (
              <ChevronDown
                size="18"
                className={`${subMenuOpen ? 'rotate-180' : ''} `}
              />
            )}
            {isOpen && item.title}
          </div>

          {isOpen && (
            <ChevronDown
              size="18"
              className={`${subMenuOpen ? 'rotate-180' : ''} `}
            />
          )}
        </Button>

        {subMenuOpen && (
          <div
            className={`my-2 ${
              isOpen ? 'ml-5' : 'ml-0 bg-dark-secondary rounded-sm'
            } flex flex-col space-y-2`}
          >
            {item.submenuItems?.map((subItem, idx) => {
              return (
                <Link key={idx} href={subItem.path}>
                  <Button
                    variant={subItem.path === pathname ? 'default' : 'ghost'}
                    className={` w-full hover:bg-dark-secondary hover:text-white ${
                      isOpen ? 'justify-start' : 'justify-center'
                    } flex gap-2 overflow-hidden ${
                      subItem.path === pathname
                        ? 'text-primary-foreground'
                        : 'text-dark-muted'
                    } `}
                  >
                    {subItem.icon}
                    {isOpen && subItem.title}
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
    <Link href={item.path}>
      <Button
        variant={isActive ? 'default' : 'ghost'}
        className={`flex w-full gap-2 hover:bg-dark-secondary hover:text-white ${
          isOpen ? 'justify-start' : 'justify-center'
        } ${isActive ? 'text-white ' : 'text-dark-muted'} `}
      >
        {item.icon}
        {isOpen && item.title}
      </Button>
    </Link>
  )
}
