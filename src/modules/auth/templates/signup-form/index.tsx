'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import { Label } from '@/modules/common/components/label/label'
import { useRouter } from 'next/navigation'
interface SignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const ADMIN_PASSWORD = 'admin'
export function SignupForm({ className, ...props }: SignupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [username, setUsername] = React.useState<string>('')
  const [adminPassword, setAdminPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState<string>('')

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      setIsLoading(false)
      return
    }
    if (adminPassword !== ADMIN_PASSWORD) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
      if (response.ok) {
        console.info('user created successfully')
        setIsLoading(false)
        router.push('/dashboard')
        return
      } else {
        setIsLoading(false)
        console.error('error', response)
        return
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      return
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="Introduce tu nombre de usuario"
              type="username"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
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
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Introduce tu contraseña"
              disabled={isLoading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirma tu contraseña"
              disabled={isLoading}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="adminPassword">Contraseña del administrador</Label>

            <Input
              id="adminPassword"
              type="password"
              placeholder="Introduce la contraseña del administrador"
              disabled={isLoading}
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Registrarme
          </Button>
        </div>
      </form>
    </div>
  )
}
