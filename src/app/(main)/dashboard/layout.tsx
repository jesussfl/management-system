import SideMenu from '@/modules/layout/components/side-menu'

import PageContainer from '@/modules/common/components/page-container'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <div className="flex flex-1 flex-col h-full overflow-y-auto bg-dark">
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  )
}
