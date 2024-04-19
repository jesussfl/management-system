import { PackagePlus } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import BackupButton from '@/modules/maintenance/components/backup'

export const metadata: Metadata = {
  title: 'Configuraciones',
  description: 'Desde aquí puedes gestionar la configuración de tu sistema',
}

export default async function Page() {
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Configuración
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona la configuración de tu sistema
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide></HeaderRightSide>
      </PageHeader>

      <PageContent>
        <BackupButton />
      </PageContent>
    </>
  )
}
