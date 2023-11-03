'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSelectedLayoutSegment } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SIDE_NAV_ITEMS } from '@/utils/constants/side-nav-items'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import Link from 'next/link'
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export function Sidebar({ className }: { className: string }) {
  const segment = useSelectedLayoutSegment()
  const [isOpen, setIsOpen] = React.useState(false)
  console.log(segment)
  const sidebarOptions = [
    {
      id: 1,
      name: 'Inicio',
      href: '/dashboard',
      icon: null,
      current: !segment ? true : false,
    },
    {
      id: 2,
      name: 'Estadísticas',
      href: '/dashboard/analytics',
      icon: null,
      current: `/${segment}` === '/analytics' ? true : false,
    },
    {
      id: 3,
      name: 'Abastecimiento',
      href: '/dashboard/supplies',
      icon: null,
      current: `/${segment}` === '/supplies' ? true : false,
      subRoutes: [
        {
          name: 'Renglones',
          href: '/dashboard/supplies/items',
          current: `/${segment}` === '/items' ? true : false,
        },
        {
          name: 'Depositos',
          href: '/dashboard/supplies/deposits',
          current: `/${segment}` === '/deposits' ? true : false,
        },
      ],
    },
    {
      id: 4,
      name: 'Personal',
      href: '/dashboard/personnel',
      icon: null,
      current: `/${segment}` === '/personnel' ? true : false,
    },
    {
      id: 5,
      name: 'Reportes',
      href: '/dashboard/reports',
      icon: null,
      current: `/${segment}` === '/reports' ? true : false,
    },
    {
      id: 6,
      name: 'Configuración',
      href: '/dashboard/settings',
      icon: null,
      current: `/${segment}` === '/settings' ? true : false,
    },
  ]

  return (
    <div className={classNames('pb-12 h-screen border-r-2', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-5 px-4 text-lg font-semibold tracking-tight">
            Sistema de Gestión
          </h2>
          <div className="flex flex-col gap-x-3 gap-y-2">
            {sidebarOptions.map((option) => (
              <div key={option.id}>
                {option.subRoutes ? (
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => setIsOpen(!isOpen)}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={
                          isOpen && option.current ? 'secondary' : 'ghost'
                        }
                        className="w-full justify-between"
                      >
                        {option.name}
                        {isOpen && option.current ? (
                          <ChevronUp
                            size={16}
                            color={isOpen ? 'black' : 'gray'}
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            color={isOpen ? 'black' : 'gray'}
                          />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-2 pl-4 py-2">
                      {option.subRoutes.map((subRoute, index) => (
                        <Link key={index} href={subRoute.href}>
                          <Button
                            variant={
                              subRoute.current ? 'secondary' : 'ghost' // Revisa la lógica de current
                            }
                            className="w-full justify-start"
                          >
                            {subRoute.name}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link href={option.href}>
                    <Button
                      variant={option.current ? 'secondary' : 'ghost'} // Revisa la lógica de current
                      className="w-full justify-start"
                    >
                      {option.name}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
