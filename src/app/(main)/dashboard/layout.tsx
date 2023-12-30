import TopNav from '@/modules/layout/components/top-nav'

import SideMenu from '@/modules/layout/components/side-menu'
import Loading from './loading'
import { Suspense } from 'react'
import PageContainer from '@/modules/common/components/page-container'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <div className="flex flex-1 flex-col h-full overflow-y-auto bg-dark">
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  )
}
