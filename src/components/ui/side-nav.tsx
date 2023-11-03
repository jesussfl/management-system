'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SIDE_NAV_ITEMS } from '@/utils/constants/side-nav-items'
import { SideNavItem } from '@/utils/types/types'
import { ChevronDown, Sun, Moon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const SideNav = () => {
  const { setTheme, theme } = useTheme()
  const defaultForeColor = theme === 'dark' ? 'gray' : 'white'
  return (
    <div className="hidden h-screen md:flex flex-1 border-r bg-background">
      <div className="flex flex-col w-full gap-2">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 md:py-3 w-full"
        >
          <span className="h-16 w-16 bg-border rounded-lg" />
          <span className="text-foreground font-medium">
            Sistema de Gestión
          </span>
        </Link>

        <ScrollArea className="h-full md:py-5">
          <div className="flex flex-col space-y-2  md:pr-6 ">
            {SIDE_NAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />
            })}
            <div className="flex md:px-4 md:py-2 justify-start gap-3">
              <Sun size={20} color={defaultForeColor} />
              <Switch
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </div>
          </div>
        </ScrollArea>
        <Separator />

        <div className="flex md:px-6 md:py-6 justify-between items-center mt-0">
          <div className="flex flex-row space-x-3 items-center">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="w-10 h-10"
              />
              <AvatarFallback />
            </Avatar>
            <div>
              <p className="font-bold text-foreground">Shadcn</p>
              <p className="text-foreground">@shadcn</p>
            </div>
          </div>
          <LogOut size={20} color={defaultForeColor} />
        </div>
      </div>
    </div>
  )
}

export default SideNav

const MenuItem = ({ item }: { item: SideNavItem }) => {
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
