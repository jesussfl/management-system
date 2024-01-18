import { prisma } from '@/lib/prisma'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { email } })

    return user
  } catch {
    return null
  }
}

export const getUserByFacialID = async (facialID: string) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { facialID } })
    return user
  } catch {
    return null
  }
}

export const getAllUsers = async () => {
  try {
    const users = await prisma.usuario.findMany()
    return users
  } catch (error) {
    console.log(error)
    return null
  }
}
