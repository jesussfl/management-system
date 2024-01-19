import { PageTemplate } from '@/modules/layout/templates/page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Administrador',
  description: 'Gestiona toda la logística del CESERLODAI',
}
export default function Page() {
  return <PageTemplate className="">hola</PageTemplate>
}
