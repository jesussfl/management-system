import PageForm from '@/modules/layout/components/page-form'

import { getGunPartById } from '../../lib/actions/parts'
import GunPartsForm from '../../components/forms/gun-parts-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunPart = await getGunPartById(Number(id))
  return (
    <PageForm
      title="Editar Parte de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunPartsForm defaultValues={gunPart} />
    </PageForm>
  )
}
