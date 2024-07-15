import PageForm from '@/modules/layout/components/page-form'

// import ChangeUserPasswordForm from '../../components/users-form/change-password-form'
import PinForm from '@/app/(auth)/components/pin-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <div className="flex w-full h-full flex-1 flex-col justify-center items-center">
      <div className="flex w-[300px] items-center justify-center flex-1 flex-col gap-4">
        <div className="flex items-center justify-start gap-4">
          <Link
            href="/auth/login"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <p className="text-center text-sm text-gray-500"> Ingresa tu PIN</p>
        </div>
        <PinForm facialId={id} />
      </div>
    </div>
  )
}
