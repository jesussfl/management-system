import { validateUserPermissions } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { redirect } from 'next/navigation'

export default async function Page() {
  const isAuthorized = await validateUserPermissions({
    section: SECTION_NAMES.AUDITORIA,
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }
  return (
    <div>
      <h1>Auditoria</h1>
    </div>
  )
}
