import { Sidebar } from '@/components/ui/sidebar'
import Header from '@/components/ui/header'
import HeaderMobile from '@/components/ui/header-mobile'
import SideNav from '@/components/ui/side-nav'
import MarginWidthWrapper from '@/components/ui/margin-witdth-wrapper'
import PageWrapper from '@/components/ui/page-wrapper'
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="fixed md:w-[256px] 2xl:w-[324px] ">
        <SideNav />
      </div>
      <div className="flex-1 ">
        <MarginWidthWrapper>
          <HeaderMobile />
          <Header />
          <PageWrapper>{children}</PageWrapper>
        </MarginWidthWrapper>
      </div>
    </section>
  )
}
