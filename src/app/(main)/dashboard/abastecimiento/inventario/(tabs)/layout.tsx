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
  HeaderRightSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { Boxes, Loader2, PackageMinus, PackagePlus, Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Layout({
  modal,

  tabs,
}: {
  modal: React.ReactNode
  children: React.ReactNode

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
        sections: [
          SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
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
            <Boxes size={24} />
            Inventario
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona todos los stocks y renglones
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/abastecimiento/recepciones/agregar"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Agregar Recepción
          </Link>

          <Link
            href="/dashboard/abastecimiento/despachos/agregar"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <PackageMinus className="mr-2 h-4 w-4" />
            Agregar Despacho
          </Link>
          <Link
            href="/dashboard/abastecimiento/inventario/renglon"
            className={buttonVariants({ variant: 'default' })}
            scroll={false}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Renglón
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="renglones" defaultSection={'inventario'}>
        <TabsList className="mx-5">
          <TabsTrigger value="renglones">Renglones</TabsTrigger>
          <TabsTrigger value="clasificaciones-y-categorias">
            Clasificaciones y Categorías{' '}
          </TabsTrigger>
          <TabsTrigger value="unidades-de-empaque">
            Unidades de empaque
          </TabsTrigger>
          <TabsTrigger value="sistemas-y-subsistemas">
            Sistemas y Subsistemas
          </TabsTrigger>
        </TabsList>
        <TabsContent value={currentSection}>{tabs}</TabsContent>
      </Tabs>
      {modal}
    </>
  )
}
