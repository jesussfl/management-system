import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
  
      CredentialsProvider({
          name: "credentials",
          credentials: {
              email: { label: "Email", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" },
          },
          async authorize(credentials  ) {
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
  secret: process.env.NEXTAUTH_SECRET,

 pages: {
   signIn: "/auth/login",
 },
  debug: process.env.NODE_ENV === "development",
 
  
} satisfies NextAuthOptions

export const { 
    handlers, 
    auth, 
    signOut 
  } = NextAuth(authOptions)