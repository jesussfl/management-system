'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Zodi } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllZodis = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const zodis = await prisma.zodi.findMany({
    include: {
      redi: true,
    },
  })

  return zodis
}

export const getZodiById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const zodi = await prisma.zodi.findUnique({
    where: {
      id,
    },
    include: {
      redi: true,
    },
  })

  if (!zodi) {
    throw new Error('Zodi not found')
  }

  return zodi
}

export const createZodi = async (data: Omit<Zodi, 'id'>) => {
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

  const exists = await prisma.zodi.findUnique({
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

  await prisma.zodi.create({
    data,
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const deleteZodi = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.zodi.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const updateZodi = async (id: number, data: Omit<Zodi, 'id'>) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const exists = await prisma.zodi.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Zodi not found',
    }
  }

  await prisma.zodi.update({
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
