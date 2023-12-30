import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Administrador',
  description: 'Gestiona toda la logística del CESERLODAI',
}
export default async function DashboardPage() {
  return (
    <div className="flex-1 max-h-full mx-0 my-3 overflow-hidden overflow-y-auto bg-background p-5 border border-border rounded-sm"></div>
  )
}
