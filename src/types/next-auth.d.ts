import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth'
import 'next-auth/jwt'
import type { User } from 'next-auth/types'
import { Prisma } from '@prisma/client'

type Rol = Prisma.RolGetPayload<{ include: { permisos: true } }>
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      nombre: string
      rol: Rol
      rol_nombre: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    nombre: string
    rol_nombre: string
    rol: Rol
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    nombre: string
    rol_nombre: string
    rol: Rol
  }
}
