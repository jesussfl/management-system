import PageForm from '@/modules/layout/components/page-form'

import UsersForm from '../components/users-form'
import { getUserById } from '../lib/actions/users'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const userData = await getUserById(id)
  return (
    <PageForm title="Editar usuario" backLink="/dashboard/usuarios">
      <UsersForm defaultValues={userData} />
    </PageForm>
  )
}
