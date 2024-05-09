import PageForm from '@/modules/layout/components/page-form'

import ChangeUserPasswordForm from '../../components/users-form/change-password-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <PageForm title="Cambiar contraseña" backLink="/dashboard/usuarios">
      <ChangeUserPasswordForm id={id} />
    </PageForm>
  )
}
