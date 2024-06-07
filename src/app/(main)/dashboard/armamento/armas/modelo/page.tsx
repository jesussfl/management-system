import PageForm from '@/modules/layout/components/page-form'
import GunModelsForm from '../components/forms/gun-models-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Tipo de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunModelsForm />
    </PageForm>
  )
}
