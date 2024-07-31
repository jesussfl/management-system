'use client'
import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { usePathname, useRouter } from 'next/navigation'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import {
  HeaderLeftSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { Loader2, LucideShield, UserSquare2 } from 'lucide-react'
import { useEffect, useState } from 'react'
export default function Layout({
  modal,
  tabs,
}: {
  modal: React.ReactNode
  tabs: React.ReactNode
  children: React.ReactNode
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
        sections: [
          SECTION_NAMES.UNIDADES,
          SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
          SECTION_NAMES.PROFESIONALES,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
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
            <LucideShield size={24} />
            Unidades Militares
          </PageHeaderTitle>
          <PageHeaderDescription>
            Registra las unidades y dividelas en Redis y Zodis
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>
      <Tabs defaultValue="unidades" defaultSection="unidades">
        <TabsList className="mx-5">
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="redis">Redis</TabsTrigger>
          <TabsTrigger value="zodis">Zodis</TabsTrigger>
        </TabsList>

        <TabsContent value={currentSection}>{tabs}</TabsContent>
      </Tabs>

      {modal}
    </>
  )
}
