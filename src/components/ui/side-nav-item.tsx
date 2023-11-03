'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SIDE_NAV_ITEMS } from '@/utils/constants/side-nav-items'
import { SideNavItem } from '@/utils/types/types'
import { ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
export const SidenavItems = () => {
  return (
    <ScrollArea className="h-full md:py-5">
      <div className="flex flex-col space-y-2 pl-3 md:pr-6 ">
        {SIDE_NAV_ITEMS.map((item, idx) => {
          return <SidenavItem key={idx} item={item} />
        })}
      </div>
    </ScrollArea>
  )
}
export const SidenavItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname()
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen)
  }
  const { theme } = useTheme()
  const selectedColor = theme === 'dark' ? 'white' : 'white'
  const defaultForeColor = theme === 'dark' ? 'white' : 'gray'

  return (
    <div className="">
      {item.submenu ? (
        <>
          <Button
            onClick={toggleSubMenu}
            variant={pathname?.includes(item.path) ? 'outline' : 'ghost'}
            className="w-full justify-between flex gap-2 2xl:py-8 lg:py-6 text-md items-center md:pl-6"
          >
            <div className="flex justify-start gap-2 items-center ">
              {item.icon &&
                item.icon(
                  item.path === pathname ? selectedColor : defaultForeColor,
                  24
                )}
              <span
                style={{
                  color: item.path === pathname ? selectedColor : 'gray',
                }}
              >
                {item.title}
              </span>
            </div>

            <ChevronDown
              size="18"
              color={'gray'}
              className={`${subMenuOpen ? 'rotate-180' : ''} flex`}
            />
          </Button>

          {subMenuOpen && (
            <div className="my-2 ml-5 flex flex-col space-y-2">
              {item.submenuItems?.map((subItem, idx) => {
                return (
                  <Link key={idx} href={subItem.path}>
                    <Button
                      variant={subItem.path === pathname ? 'default' : 'ghost'}
                      className="w-full justify-start flex gap-2 2xl:py-8 lg: py-6 text-md md:pl-6"
                    >
                      {subItem.icon &&
                        subItem.icon(
                          subItem.path === pathname ? selectedColor : 'gray',
                          24
                        )}
                      <span
                        style={{
                          color:
                            subItem.path === pathname ? selectedColor : 'gray',
                        }}
                      >
                        {subItem.title}
                      </span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <Link href={item.path}>
          <Button
            variant={item.path === pathname ? 'default' : 'ghost'}
            className="w-full justify-start flex gap-2 2xl:py-8 lg:py-6 text-md hover:text-primary md:pl-6"
          >
            {item.icon &&
              item.icon(item.path === pathname ? selectedColor : 'gray', 24)}
            <span
              className={[
                item.path === pathname ? 'text-white' : 'text-gray-500',
              ].join(' ')}
            >
              {item.title}
            </span>
          </Button>
        </Link>
      )}
    </div>
  )
}
