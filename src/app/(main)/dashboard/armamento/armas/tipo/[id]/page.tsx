import PageForm from '@/modules/layout/components/page-form'

import { getGunTypeById } from '../../lib/actions/type'
import GunTypesForm from '../../components/forms/gun-types-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunType = await getGunTypeById(Number(id))
  return (
    <PageForm title="Editar Tipo de Arma" backLink="/dashboard/armamento/armas">
      <GunTypesForm defaultValues={gunType} />
    </PageForm>
  )
}
