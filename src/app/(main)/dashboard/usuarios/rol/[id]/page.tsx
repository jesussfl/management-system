import PageForm from '@/modules/layout/components/page-form'

import RolesForm from '../../components/roles-form'
import { getRolById } from '../../lib/actions/roles'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const rolData = await getRolById(Number(id))
  return (
    <PageForm title="Editar Rol" backLink="/dashboard/usuarios">
      <RolesForm defaultValues={rolData} />
    </PageForm>
  )
}
