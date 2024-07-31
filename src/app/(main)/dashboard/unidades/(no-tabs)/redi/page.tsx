import RedisForm from '../../components/forms/redi-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm title="Agregar Redi" backLink="/dashboard/unidades">
      <RedisForm />
    </PageForm>
  )
}
