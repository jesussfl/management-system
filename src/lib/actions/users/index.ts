import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getAllUsers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const users = await prisma.usuario.findMany()
  return users
}
