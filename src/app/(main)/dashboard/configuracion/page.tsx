import { DatabaseBackup } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import BackupButton from './components/backup'

export const metadata: Metadata = {
  title: 'Restauración y Copia de Seguridad',
  description: 'Desde aqui puedes gestionar los respaldos del sistema',
}

export default async function Page() {
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <DatabaseBackup size={24} />
            Restauración y Copia de Seguridad
          </PageHeaderTitle>
          <PageHeaderDescription>
            Desde aqui puedes gestionar los respaldos del sistema
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>

      <PageContent>
        <BackupButton />
      </PageContent>
    </>
  )
}
