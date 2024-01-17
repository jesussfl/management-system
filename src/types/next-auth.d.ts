import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth'
import 'next-auth/jwt'
import type { User } from 'next-auth/types'
import { Prisma } from '@prisma/client'

type Rol = Prisma.rolGetPayload<{ include: { permisos: true } }>
declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string
      rol_nombre: string
      rol: Rol
    }
  }

  interface User {
    id: string
    rol_nombre: string
    rol: Rol
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    rol_nombre: string
    rol: Rol
  }
}
