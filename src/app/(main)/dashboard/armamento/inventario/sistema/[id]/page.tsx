import SystemForm from '@/app/(main)/dashboard/components/system-form'
import { getSystemById } from '@/app/(main)/dashboard/lib/actions/systems'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const systemData = await getSystemById(Number(id))
  return (
    <PageForm title="Editar Sistema" backLink="/dashboard/armamento/inventario">
      <SystemForm defaultValues={systemData} />
    </PageForm>
  )
}
