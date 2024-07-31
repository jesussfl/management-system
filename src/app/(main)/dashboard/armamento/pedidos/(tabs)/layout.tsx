'use client'
import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { usePathname, useRouter } from 'next/navigation'
import {
  HeaderLeftSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { Loader2, PackagePlus } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import { useState, useEffect } from 'react'
export default function Layout({
  children,
  tabs,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  tabs: React.ReactNode
}) {
  const pathname = usePathname()
  const currentSection = pathname.substring(pathname.lastIndexOf('/') + 1)
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const validateKeys = async () => {
      setIsLoading(true)
      const isAuthorized = await validateSections({
        sections: [SECTION_NAMES.PEDIDOS_ARMAMENTO, SECTION_NAMES.ARMAMENTO],
      })

      setIsAuthorized(isAuthorized)
      setIsLoading(false)
    }

    validateKeys()
  }, [])

  if (isLoading)
    <div className="flex justify-center items-center fixed inset-0 bg-black/60">
      <Loader2 className="animate-spin" size={88} color="white" />
    </div>

  if (!isAuthorized && !isLoading) {
    router.replace('/dashboard')

    return null
  }

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Pedidos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona los pedidos del inventario de armamento
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>

      <Tabs defaultValue="pedidos" defaultSection="pedidos">
        <TabsList className="mx-5">
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value={currentSection}>{tabs}</TabsContent>
      </Tabs>
      {modal}
    </>
  )
}
