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
    <div className="flex flex-col w-full justify-center items-center gap-4 ">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Inicio de Sesión
          </h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido!, por favor ingresa tus datos.
          </p>
        </div>
        <LoginForm />
        <Link
          href="/auth/signup"
          className={cn(buttonVariants({ variant: 'ghost' }), 'self-stretch')}
        >
          No tengo una cuenta
        </Link>
      </div>
    </div>
  )
}
