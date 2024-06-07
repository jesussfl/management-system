import PageForm from '@/modules/layout/components/page-form'
import GunAccessoriesForm from '../components/forms/gun-accessories-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Accesorio de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunAccessoriesForm />
    </PageForm>
  )
}
