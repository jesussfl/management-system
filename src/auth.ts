import NextAuth from 'next-auth'
import bcrypt from 'bcryptjs'
import Credentials from '@auth/core/providers/credentials'

import type { NextAuthConfig } from 'next-auth'
import { prisma } from './lib/prisma-auth'

/**
 * Authentication Configuration
 *
 * This file configures authentication using NextAuth and Prisma.
 * It defines the authentication options, including the use of PrismaAdapter
 * for database interactions, credentials provider for email/password authentication,
 * JWT session strategy, and various callbacks for token and session management.
 *
 * @file auth.ts
 * @see https://next-auth.js.org/getting-started/introduction
 */

export const authOptions = {
  // adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        facialID: { label: 'Facial ID', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, facialID } = credentials as {
          email: string
          password?: string
          facialID?: string
        }
        // check to see if email and password is there
        if (!password && facialID) {
          const user = await prisma.usuario.findUnique({
            where: {
              facialID,
            },
            include: {
              rol: {
                include: {
                  permisos: true,
                },
              },
            },
          })
          return user
        }
        if (!email || !password) {
          return null
        }

        // check to see if user exists
        const user = await prisma.usuario.findUnique({
          where: {
            email,
          },
          include: {
            rol: {
              include: {
                permisos: true,
              },
            },
          },
        })
        // if no user was found
        if (!user || !user?.contrasena) {
          return null
        }

        // check to see if password matches
        const passwordMatch = await bcrypt.compare(password, user.contrasena)

        // if password does not match
        if (passwordMatch) {
          return user
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 10000, // 20seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        token.nombre = session.user.nombre
        token.id = session.user.id
        token.rol = session.user.rol
        token.rol_nombre = session.user.rol_nombre
      } else if (user) {
        token.nombre = user.nombre
        token.id = user.id
        token.rol_nombre = user.rol_nombre
        token.rol = user.rol
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.nombre = token.nombre
        session.user.id = token.id
        session.user.rol_nombre = token.rol_nombre
        session.user.rol = token.rol
      }
      return session
    },
    authorized(params) {
      return !!params.auth?.user
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signOut, signIn, update } = NextAuth(authOptions)
