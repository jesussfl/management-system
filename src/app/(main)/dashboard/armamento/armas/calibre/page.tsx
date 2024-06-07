import PageForm from '@/modules/layout/components/page-form'
import GunCalibersForm from '../components/forms/gun-calibers-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Calibre de Arma"
      backLink="/dashboard/armamento/armas"
    >
      <GunCalibersForm />
    </PageForm>
  )
}
