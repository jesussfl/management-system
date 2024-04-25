'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Usuario } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllUsers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const users = await prisma.usuario.findMany()
  return users
}

export const getUserById = async (id: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const user = await prisma.usuario.findUnique({
    where: {
      id,
    },
    include: {
      rol: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }
  return {
    ...user,
    rol: user.rol.id,
  }
}

export const updateUser = async (
  id: string,
  data: Omit<Usuario, 'id'> & { rol: number }
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      rol: {
        connect: {
          id: data.rol,
        },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  revalidatePath('/dashboard/usuarios')
  return {
    success: 'User updated successfully',
  }
}
