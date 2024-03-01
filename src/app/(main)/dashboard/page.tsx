import { backup } from '@/lib/actions/admin'
import { Button } from '@/modules/common/components/button'
import { PageTemplate } from '@/modules/layout/templates/page'
import BackupButton from '@/modules/maintenance/components/backup'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Administrador',
  description: 'Gestiona toda la logística del CESERLODAI',
}

export default async function Page() {
  return <PageTemplate className="">{/* <BackupButton /> */}</PageTemplate>
}
