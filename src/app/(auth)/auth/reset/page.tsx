import { ResetForm } from '@/app/(auth)/components/reset-form'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Reestablecer contraseña',
  description: 'Reestablece tu contraseña',
}
const ResetPage = () => {
  return <ResetForm />
}

export default ResetPage
