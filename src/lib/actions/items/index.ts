'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Renglones } from '@prisma/client'

type FormValues = Omit<Renglones, 'id'>
export const createItem = async (data: FormValues) => {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('You must be signed in to perform this action')
    }
    const { nombre } = data
    const exist = await prisma.renglones.findUnique({
      where: {
        nombre,
      },
    })
    if (exist) {
      throw new Error('Renglon already exists')
    }

    await prisma.renglones.create({
      data,
    })
    revalidatePath('/dashboard/abastecimiento/renglones')
  } catch (error) {
    console.log(error)
  }
}

export const updateItem = async (id: number, data: FormValues) => {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('You must be signed in to perform this action')
    }

    await prisma.renglones.update({
      where: {
        id,
      },
      data,
    })
    revalidatePath('/dashboard/abastecimiento/inventario')
  } catch (error) {
    console.log(error)
  }
}

export const deleteItem = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  await prisma.renglones.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/recibimientos')
}
export const checkRowItemExists = async (name: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  if (!name) {
    return false
  }

  const exists = await prisma.renglones.findUnique({
    where: {
      nombre: name,
    },
  })

  return !!exists
}

export const getAllItems = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const renglones = await prisma.renglones.findMany({
    include: {
      recibimientos: true,
    },
  })
  return renglones
}
