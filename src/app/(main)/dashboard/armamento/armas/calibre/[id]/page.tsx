import PageForm from '@/modules/layout/components/page-form'

import { getGunCaliberById } from '../../lib/actions/calibre'
import GunCalibersForm from '../../components/forms/gun-calibers-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunCaliber = await getGunCaliberById(Number(id))
  return (
    <PageForm
      title="Editar Calibre de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunCalibersForm defaultValues={gunCaliber} />
    </PageForm>
  )
}
