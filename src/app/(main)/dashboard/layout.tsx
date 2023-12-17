import Header from '@/modules/layout/components/top-menu'

import Nav from '@/modules/layout/templates/nav'
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Nav />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <Header />
        {children}
      </div>
    </div>
  )
}
