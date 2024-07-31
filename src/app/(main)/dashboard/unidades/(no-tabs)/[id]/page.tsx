import PageForm from '@/modules/layout/components/page-form'
import { getUnitById } from '../../lib/actions/units'
import UnitsForm from '../../components/forms/unit-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const unitData = await getUnitById(Number(id))
  return (
    <PageForm title="Editar Unidad" backLink="/dashboard/unidades">
      <UnitsForm defaultValues={unitData} />
    </PageForm>
  )
}
