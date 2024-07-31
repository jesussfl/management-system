import PageForm from '@/modules/layout/components/page-form'

import ChangeUserFacialIDForm from '../../../components/users-form/change-facialID-form'
import { prisma } from '@/lib/prisma'
import { getUserById } from '../../../lib/actions/users'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const adminPasswordDb = (await prisma.admin.findFirst({
    where: {
      state: 'Activa',
    },
  })) as { password: string }

  const userData = await getUserById(id)
  return (
    <PageForm title="Asignar ID Facial" backLink="/dashboard/usuarios">
      <ChangeUserFacialIDForm
        id={id}
        email={userData?.email}
        adminPassword={adminPasswordDb?.password}
        currentFacialID={userData?.facialID}
      />
    </PageForm>
  )
}
