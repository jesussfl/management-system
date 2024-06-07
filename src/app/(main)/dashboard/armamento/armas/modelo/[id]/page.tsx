import PageForm from '@/modules/layout/components/page-form'

import GunModelsForm from '../../components/forms/gun-models-form'
import { getGunModelById } from '../../lib/actions/model-actions'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunModel = await getGunModelById(Number(id))
  return (
    <PageForm
      title="Editar Modelo de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunModelsForm defaultValues={gunModel} />
    </PageForm>
  )
}
