'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getAllPresentations = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const classifications = await prisma.unidadEmpaque.findMany()
  return classifications
}
