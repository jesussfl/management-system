import { Metadata } from 'next'
import AttendanceInfoContainer from './attendance-info-container'
export const metadata: Metadata = {
  title: 'Consulta de Información',
  description: 'Información de asistencias',
}
export default async function Page({
  params: { userId },
}: {
  params: { userId: string }
}) {
  return (
    <div className="flex flex-col justify-center items-center p-4 h-screen lg:min-h-screen lg:max-h-screen lg:flex-row lg:p-8 md:p-5 bg-gray-200">
      <AttendanceInfoContainer userId={userId} />
    </div>
  )
}
