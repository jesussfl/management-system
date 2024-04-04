'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Clasificacion, Sistema } from '@prisma/client'
export const createSystem = async (
  data: Omit<Sistema, 'id' | 'fecha_creacion' | 'ultima_actualizacion'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { nombre } = data

  if (!nombre) {
    return {
      field: 'nombre',
      error: 'El nombre es obligatorio',
    }
  }

  await prisma.sistema.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'sistema creado exitosamente',
  }
}

export const updateSystem = async (
  id: number,
  data: Omit<Sistema, 'id' | 'fecha_creacion' | 'ultima_actualizacion'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.sistema.update({
    where: {
      id,
    },
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'sistema actualizado exitosamente',
  }
}

export const deleteSystem = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.sistema.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/inventario')
}

export const getAllSystems = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const systems = await prisma.sistema.findMany()
  return systems
}

export const getSystemById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const system = await prisma.sistema.findUnique({
    where: {
      id,
    },
  })

  if (!system) {
    throw new Error('sistema no existe')
  }
  return system
}
