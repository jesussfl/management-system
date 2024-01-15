import NextAuth, { DefaultSession, DefaultJWT } from "next-auth"
import "next-auth/jwt"
import type { User } from "next-auth/types"

declare module "next-auth" {
  interface Session {
    user: User & {       
      id: string
      rol_nombre: String | null | undefined
    }
  }

  interface User {
    id: string
    rol_nombre: String
  }

}

declare module '@auth/core/jwt' {
  interface JWT {
      id: string
      rol_nombre: String
  }
}