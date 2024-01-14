import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/modules/common/components/button'
import LoginForm from '@/modules/auth/templates/login-form'

export const metadata: Metadata = {
  title: 'Inicio de sesión',
  description: 'Inicia sesion en tu cuenta',
}

export default function Page() {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-4 bg-border ">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[480px] bg-white p-9 rounded-md">
        <div className="flex flex-col space-y-2 ">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
            Inicia sesión con tu cuenta
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus datos correspondientes para acceder al sistema.
          </p>
        </div>
        <LoginForm />
        <Link
          href="/auth/signup"
          className={cn(
            buttonVariants({ variant: 'secondary' }),
            'self-stretch'
          )}
        >
          No tengo una cuenta
        </Link>
      </div>
    </div>
  )
}
