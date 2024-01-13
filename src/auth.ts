import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import Credentials from "@auth/core/providers/credentials"
import type { Adapter } from '@auth/core/adapters';
export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              const { email, password } = credentials as {
                  email: string;
                  password: string;
              };
                // check to see if email and password is there
                if(!email || !password) {
                    throw new Error('Please enter an email and password')
                }
  
                // check to see if user exists
                const user = await prisma.user.findUnique({
                    where: {
                        email
                    }
                });
                console.log(user)
                // if no user was found 
                if (!user || !user?.password) {
  
                  console.log(user)
                    throw new Error('No user found')
                }
  
                // check to see if password matches
                const passwordMatch = await bcrypt.compare(password, user.password)
  
                // if password does not match
                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }
  
                return user;
            },
        }),  
    ],
  session:{
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
   signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    authorized(params) {
      return !!params.auth?.user;
    },
  }
 
  
} satisfies NextAuthConfig

export const { 
    handlers, 
    auth, 
    signOut 
  } = NextAuth(authOptions)