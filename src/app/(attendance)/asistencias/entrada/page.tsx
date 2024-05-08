import PageForm from '@/modules/layout/components/page-form'
import ValidationForm from '../components/verification-form'

export default async function Page() {
  return (
    <PageForm title="Verificar entrada" backLink="/asistencias">
      <ValidationForm type="entrada" />
    </PageForm>
  )
}
