'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Destinatario, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createReceiver = async (data: Omit<Destinatario, 'id'>) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const exists = await prisma.destinatario.findUnique({
    where: {
      cedula: data.cedula,
    },
  })

  if (exists) {
    return {
      error: 'Receiver already exists',
      field: 'cedula',
    }
  }

  await prisma.destinatario.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Receiver created successfully',
  }
}

export const getAllReceivers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const receivers = await prisma.destinatario.findMany({
    include: {
      despachos: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })
  return receivers
}

export const deleteReceiver = async (cedula: string) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.destinatario.delete({
    where: {
      cedula,
    },
  })

  revalidatePath('/dashboard/abastecimiento/destinatarios')
}
