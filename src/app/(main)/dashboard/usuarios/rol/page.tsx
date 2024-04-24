import PageForm from '@/modules/layout/components/page-form'

import RolesForm from '../components/roles-form'

export default async function Page() {
  return (
    <PageForm title="Crear Permiso" backLink="/dashboard/usuarios">
      <RolesForm />
    </PageForm>
  )
}
