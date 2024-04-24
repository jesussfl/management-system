import PageForm from '@/modules/layout/components/page-form'

import PermissionsForm from '../components/permissions-form'

export default async function Page() {
  return (
    <PageForm title="Crear Permiso" backLink="/dashboard/usuarios">
      <PermissionsForm />
    </PageForm>
  )
}
