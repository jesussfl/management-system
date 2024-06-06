import PageForm from '@/modules/layout/components/page-form'
import SubsystemForm from '../../components/subsystem-form'
import { getSubsystemById } from '../../lib/actions/subsystems'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const subsystemData = await getSubsystemById(Number(id))
  return (
    <PageForm
      title="Editar Subsistema"
      backLink="/dashboard/armamento/inventario"
    >
      <SubsystemForm defaultValues={subsystemData} />
    </PageForm>
  )
}
