import PageForm from '@/modules/layout/components/page-form'
import GunTypesForm from '../components/forms/gun-types-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Tipo de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunTypesForm />
    </PageForm>
  )
}
