import PageForm from '@/modules/layout/components/page-form'
import ValidationForm from '../components/verification-form'

export default async function Page() {
  return (
    <PageForm title="Verificar salida" backLink="/asistencias">
      <ValidationForm type="salida" />
    </PageForm>
  )
}
