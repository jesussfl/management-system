import PageForm from '@/modules/layout/components/page-form'
import PermissionsForm from '../../components/permissions-form'
import { getPermissionById } from '../../lib/actions/permissions'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const permissionsData = await getPermissionById(Number(id))
  return (
    <PageForm title="Editar Permiso" backLink="/dashboard/usuarios">
      <PermissionsForm defaultValues={permissionsData} />
    </PageForm>
  )
}
