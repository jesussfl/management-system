import PageForm from '@/modules/layout/components/page-form'

import { getAccessoryById } from '../../lib/actions/accesories'
import GunAccessoriesForm from '../../components/forms/gun-accessories-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunAccessory = await getAccessoryById(Number(id))
  return (
    <PageForm
      title="Editar Accesorio de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunAccessoriesForm defaultValues={gunAccessory} />
    </PageForm>
  )
}
