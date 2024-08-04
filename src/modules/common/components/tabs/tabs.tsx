'use client'

import { cn } from '@/utils/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

interface Context {
  defaultValue: string
  hrefFor: (value: string) => LinkProps['href']
  defaultSection?: string
  selected: string
}
const TabsContext = React.createContext<Context>(null as any)

export function Tabs(props: {
  children: React.ReactNode
  className?: string
  /**
   * The default tab
   */
  defaultValue: string
  /**
   * Which search param to use
   * @default "tab"
   */
  defaultSection?: string
}) {
  const { children, className, defaultSection, ...other } = props
  const pathname = usePathname()
  const currentSection = pathname.substring(pathname.lastIndexOf('/') + 1)

  const selected = currentSection

  const hrefFor: Context['hrefFor'] = React.useCallback(
    (value) => {
      if (value === other.defaultValue) {
        return pathname.substring(0, pathname.lastIndexOf('/'))
      }

      if (currentSection === defaultSection) {
        const newPath = `${pathname}/${value}`
        return newPath
      }

      return pathname.replace(`/${currentSection}`, `/${value}`)
    },
    [pathname, currentSection, defaultSection, other.defaultValue]
  )

  return (
    <TabsContext.Provider
      value={{ ...other, hrefFor, defaultSection, selected }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

const useContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error(
      'Tabs compound components cannot be rendered outside the Tabs component'
    )
  }

  return context
}

export function TabsList(props: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      {...props}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-gray-200 p-1 text-muted-foreground',
        props.className
      )}
    />
  )
}

export const TabsTrigger = (props: {
  children: React.ReactNode
  className?: string
  value: string
}) => {
  const context = useContext()
  const pathname = usePathname()
  const currentSection = pathname.substring(pathname.lastIndexOf('/') + 1)
  const defaultSection = context.defaultSection
  const selected = currentSection === defaultSection ? context.defaultValue : ''
  const hrefValue = selected === props.value ? selected : props.value
  return (
    <Link
      {...props}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props.className
      )}
      data-state={
        context.selected === props.value
          ? 'active'
          : selected === props.value
          ? 'active'
          : 'inactive'
      }
      href={context.hrefFor(hrefValue)}
      scroll={false}
      shallow={true}
    />
  )
}

export function TabsContent(props: {
  children: React.ReactNode
  className?: string
  value: string
  href?: string
}) {
  const context = useContext()
  // console.log(context, props.value)
  if (
    context.selected !== props.value &&
    context.defaultSection !== props.value
  ) {
    return null
  }
  return (
    <div
      {...props}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.className
      )}
    />
  )
}
