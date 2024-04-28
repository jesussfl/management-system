import { validateSectionsAndPermissions } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { redirect } from 'next/navigation'
export default async function Layout({
  modal,
  children,
}: {
  modal: React.ReactNode
  children: React.ReactNode
}) {
  const isAuthorized = await validateSectionsAndPermissions({
    sections: [SECTION_NAMES.USUARIOS],
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }
  return (
    <>
      {children}
      {modal}
    </>
  )
}
