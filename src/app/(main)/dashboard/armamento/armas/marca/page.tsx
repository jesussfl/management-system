import PageForm from '@/modules/layout/components/page-form'
import GunBrandsForm from '../components/forms/gun-brands-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Marca de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunBrandsForm />
    </PageForm>
  )
}
