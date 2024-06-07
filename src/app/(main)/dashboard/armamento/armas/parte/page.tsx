import PageForm from '@/modules/layout/components/page-form'
import GunPartsForm from '../components/forms/gun-parts-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Parte de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunPartsForm />
    </PageForm>
  )
}
