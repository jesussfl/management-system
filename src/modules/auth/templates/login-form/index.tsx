'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/modules/common/components/button/button'
import { useRouter } from 'next/navigation'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button/button'
import { Input } from '@/modules/common/components/input/input'
import { Label } from '@/modules/common/components/label/label'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const data = { email, password }
    signIn('credentials', { ...data, redirect: false }).then((callback) => {
      if (callback?.error) {
        setIsLoading(false)
        console.error(callback.error)
      }

      if (callback?.ok && !callback?.error) {
        setIsLoading(false)
        console.info('Logged in successfully!')
        router.push('/dashboard')
      }
    })
  }

  return (
    <form onSubmit={loginUser}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            placeholder="nombre@ejemplo.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            disabled={isLoading}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Link
            href="/auth/signup"
            className={cn(buttonVariants({ variant: 'ghost' }), '')}
          >
            Olvidé mi contraseña
          </Link>
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar sesión
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
