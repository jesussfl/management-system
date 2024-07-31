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
          SECTION_NAMES.RANGOS,
          SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
          SECTION_NAMES.PROFESIONALES,
          SECTION_NAMES.ABASTECIMIENTO,
          SECTION_NAMES.RECURSOS_HUMANOS,
          SECTION_NAMES.ARMAMENTO,
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
            Rangos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Registra los componentes, grados y categorías militares
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>
      <Tabs defaultValue="componentes" defaultSection="rangos">
        <TabsList className="mx-5">
          <TabsTrigger value="componentes">Componentes</TabsTrigger>
          <TabsTrigger value="grados">Grados</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
        </TabsList>

        <TabsContent value={currentSection}>{tabs}</TabsContent>
      </Tabs>

      {modal}
    </>
  )
}
