import { getRediById } from '../../../lib/actions/redis'
import RedisForm from '../../../components/forms/redi-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const redisData = await getRediById(Number(id))
  return (
    <PageForm title="Editar Redi" backLink="/dashboard/unidades">
      <RedisForm defaultValues={redisData} />
    </PageForm>
  )
}
