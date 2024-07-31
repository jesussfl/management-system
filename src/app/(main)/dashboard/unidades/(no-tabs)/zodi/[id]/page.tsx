import PageForm from '@/modules/layout/components/page-form'
import { getZodiById } from '../../../lib/actions/zodis'
import ZodisForm from '../../../components/forms/zodi-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const zodisData = await getZodiById(Number(id))
  return (
    <PageForm title="Editar Zodi" backLink="/dashboard/unidades">
      <ZodisForm defaultValues={zodisData} />
    </PageForm>
  )
}
