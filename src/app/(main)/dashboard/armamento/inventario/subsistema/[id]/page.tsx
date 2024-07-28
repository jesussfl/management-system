import SubsystemForm from '@/app/(main)/dashboard/components/subsystem-form'
import { getSubsystemById } from '@/app/(main)/dashboard/lib/actions/subsystems'
import PageForm from '@/modules/layout/components/page-form'

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
