import TopNav from '@/modules/layout/components/top-nav'

import SideMenu from '@/modules/layout/templates/side-menu'
import Loading from './loading'
import { Suspense } from 'react'
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <TopNav />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  )
}
