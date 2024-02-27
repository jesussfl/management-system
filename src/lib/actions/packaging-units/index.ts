'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UnidadEmpaque } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createPackagingUnit = async (data: Omit<UnidadEmpaque, 'id'>) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data
  const exist = await prisma.unidadEmpaque.findUnique({
    where: {
      nombre,
    },
  })

  if (exist) {
    return {
      field: 'nombre',
      error: 'Esta Unidad de empaque ya existe',
    }
  }

  await prisma.unidadEmpaque.create({
    data,
  })

  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Unidad de empaque creada exitosamente',
  }
}

export const updatePackagingUnit = async (
  id: number,
  data: Omit<UnidadEmpaque, 'id'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.unidadEmpaque.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Unidad de empaque actualizada exitosamente',
  }
}

export const deletePackagingUnit = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.unidadEmpaque.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/inventario')
}

export const getAllPackagingUnits = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const packagingUnits = await prisma.unidadEmpaque.findMany()
  return packagingUnits
}
