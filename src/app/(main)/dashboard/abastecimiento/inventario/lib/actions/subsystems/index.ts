'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Clasificacion, Subsistema } from '@prisma/client'
export const createSubsystem = async (
  data: Omit<Subsistema, 'id' | 'fecha_creacion' | 'ultima_actualizacion'>
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

  await prisma.subsistema.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Subsistema creado exitosamente',
  }
}

export const updateSubsystem = async (
  id: number,
  data: Omit<Subsistema, 'id' | 'fecha_creacion' | 'ultima_actualizacion'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.subsistema.update({
    where: {
      id,
    },
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Subsistema actualizado exitosamente',
  }
}

export const deleteSubsystem = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.subsistema.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/inventario')
}

export const getAllSubsystems = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const subsystems = await prisma.subsistema.findMany({
    include: {
      sistema: true,
    },
  })
  return subsystems
}

export const getSubsystemById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const subsystem = await prisma.subsistema.findUnique({
    where: {
      id,
    },
    include: {
      sistema: true,
    },
  })

  if (!subsystem) {
    throw new Error('sistema no existe')
  }
  return subsystem
}
