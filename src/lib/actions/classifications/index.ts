'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Clasificacion } from '@prisma/client'
export const createClassification = async (data: Omit<Clasificacion, 'id'>) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { nombre } = data
  const exist = await prisma.clasificacion.findUnique({
    where: {
      nombre,
    },
  })
  if (exist) {
    return {
      field: 'nombre',
      error: 'Esta clasificación ya existe',
    }
  }

  await prisma.clasificacion.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Clasificación creado exitosamente',
  }
}

export const updateClassification = async (
  id: number,
  data: Omit<Clasificacion, 'id'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.clasificacion.update({
    where: {
      id,
    },
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Clasificación actualizado exitosamente',
  }
}

export const deleteClassification = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.clasificacion.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/inventario')
}

export const getAllClassifications = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const classifications = await prisma.clasificacion.findMany()
  return classifications
}

export const getClassificationById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const classification = await prisma.clasificacion.findUnique({
    where: {
      id,
    },
  })

  if (!classification) {
    throw new Error('Clasificación no existe')
  }
  return classification
}
