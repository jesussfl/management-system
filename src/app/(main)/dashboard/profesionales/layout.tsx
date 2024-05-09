import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import getSectionInfo from '@/utils/helpers/get-path-info'
import { redirect } from 'next/navigation'
export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const requiredSections =
    getSectionInfo({
      sectionName: SECTION_NAMES.PROFESIONALES,
      property: 'requiredPermissions',
    }) || []

  const isAuthorized = await validateSections({
    sections: requiredSections,
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
