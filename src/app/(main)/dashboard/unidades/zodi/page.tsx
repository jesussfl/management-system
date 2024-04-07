import PageForm from '@/modules/layout/components/page-form'
import ZodisForm from '../components/forms/zodi-form'

export default async function Page() {
  return (
    <PageForm title="Agregar Zodi" backLink="/dashboard/unidades">
      <ZodisForm />
    </PageForm>
  )
}
