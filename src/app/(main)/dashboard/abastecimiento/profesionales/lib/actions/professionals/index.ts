'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  Destinatario,
  Prisma,
  Profesional_Abastecimiento,
} from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createProfessional = async (
  data: Omit<Profesional_Abastecimiento, 'id'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      cedula: data.cedula,
    },
  })

  if (exists) {
    return {
      error: 'El profesional ya existe',
      field: 'cedula',
    }
  }

  await prisma.profesional_Abastecimiento.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/profesionales')

  return {
    success: 'Professional created successfully',
  }
}

export const getAllProfessionals = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const professionals = await prisma.profesional_Abastecimiento.findMany({
    include: {
      despachos: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })
  return professionals
}

export const deleteProfessional = async (cedula: string) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.destinatario.delete({
    where: {
      cedula,
    },
  })

  revalidatePath('/dashboard/abastecimiento/profesionales')
}

export const updateProfessional = async (
  data: Prisma.Profesional_AbastecimientoUpdateInput,
  id: number
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'professional not found',
    }
  }

  await prisma.profesional_Abastecimiento.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  })

  revalidatePath('/dashboard/abastecimiento/profesionales')

  return {
    success: 'Professional updated successfully',
  }
}

export const getProfessionalById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const professional = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      id,
    },
    include: {
      despachos: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })

  if (!professional) {
    throw new Error('Receiver not found')
  }
  return professional
}
