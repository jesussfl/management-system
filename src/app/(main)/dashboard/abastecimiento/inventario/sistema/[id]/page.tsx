import PageForm from '@/modules/layout/components/page-form'
import SystemForm from '../../../../components/system-form'
import { getSystemById } from '../../../../lib/actions/systems'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const systemData = await getSystemById(Number(id))
  return (
    <PageForm
      title="Editar Sistema"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <SystemForm defaultValues={systemData} />
    </PageForm>
  )
}
