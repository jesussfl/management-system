'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Redi } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllRedis = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const redis = await prisma.redi.findMany({
    include: {
      zodis: true,
    },
  })

  return redis
}

export const getRediById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const redi = await prisma.redi.findUnique({
    where: {
      id,
    },
    include: {
      zodis: true,
    },
  })

  if (!redi) {
    throw new Error('Redi not found')
  }

  return redi
}

export const createRedi = async (data: Omit<Redi, 'id'>) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
    }
  }

  const exists = await prisma.redi.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'El nombre ya existe',
      field: 'nombre',
    }
  }

  await prisma.redi.create({
    data,
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const deleteRedi = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.redi.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const updateRedi = async (id: number, data: Prisma.RediUpdateInput) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const exists = await prisma.redi.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'redi not found',
    }
  }

  await prisma.redi.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}
