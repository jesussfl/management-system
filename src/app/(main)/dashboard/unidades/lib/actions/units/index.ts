'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Unidad_Militar } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllUnits = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const units = await prisma.unidad_Militar.findMany({
    include: {
      zodi: true,
    },
  })

  return units
}

export const getUnitById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const unit = await prisma.unidad_Militar.findUnique({
    where: {
      id,
    },
    include: {
      zodi: true,
    },
  })

  if (!unit) {
    throw new Error('Unit not found')
  }

  return unit
}

export const createUnit = async (data: Omit<Unidad_Militar, 'id'>) => {
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

  const exists = await prisma.unidad_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'Name already exists',
      field: 'nombre',
    }
  }

  await prisma.unidad_Militar.create({
    data,
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const deleteUnit = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.unidad_Militar.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const updateUnit = async (
  id: number,
  data: Omit<Unidad_Militar, 'id'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const exists = await prisma.unidad_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Unit not found',
    }
  }

  await prisma.unidad_Militar.update({
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
