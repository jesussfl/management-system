import PageForm from '@/modules/layout/components/page-form'

import GunBrandsForm from '../../components/forms/gun-brands-form'
import { getGunBrandById } from '../../lib/actions/brand'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunBrand = await getGunBrandById(Number(id))
  return (
    <PageForm
      title="Editar Marca de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunBrandsForm defaultValues={gunBrand} />
    </PageForm>
  )
}
