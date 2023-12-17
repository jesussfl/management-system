import React from 'react'
import Nav from '@/modules/layout/templates/nav'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      <main className="relative">{children}</main>
    </div>
  )
}
