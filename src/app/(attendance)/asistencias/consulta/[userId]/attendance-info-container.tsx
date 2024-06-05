'use client'
import PageForm from '@/modules/layout/components/page-form'
import { ArrowLeft, Loader2, Rocket } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import useUserData from '../../lib/hooks/useUserData'
import useAttendance from '../../lib/hooks/useAttendance'
import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
export default function AttendanceInfoContainer({
  userId,
}: {
  userId: string
}) {
  const { dataToShow, isLoading: isDataLoading } = useUserData(userId)
  const {
    inTime,
    outTime,
    isLoading: isAttendancesLoading,
  } = useAttendance(userId)

  if (isDataLoading || isAttendancesLoading)
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-black/60">
        <Loader2 className="animate-spin" size={88} color="white" />
      </div>
    )
  return (
    <div className="flex flex-col justify-center items-center p-4 lg:p-8 md:p-5 bg-background">
      <PageHeader className="justify-start gap-8">
        <Link
          href={`/asistencias`}
          className={buttonVariants({ variant: 'outline' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
        <PageHeaderTitle>{`Consulta de Información`}</PageHeaderTitle>
      </PageHeader>
      <Alert variant={'success'} className="mb-6">
        <Rocket className="h-4 w-4" />
        <AlertTitle>Hora de Entrada: </AlertTitle>
        <AlertDescription>{inTime}</AlertDescription>
      </Alert>
      <Alert variant={'destructive'}>
        <Rocket className="h-4 w-4" />
        <AlertTitle>Hora de Salida: </AlertTitle>
        <AlertDescription>{outTime}</AlertDescription>
      </Alert>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {dataToShow?.map(({ title, info }) => (
            <UserDetail key={title} title={title} info={info} />
          ))}
        </dl>
      </div>
    </div>
  )
}

function UserDetail({ title, info }: { title: string; info: string | number }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">{title}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {info}
      </dd>
    </div>
  )
}
