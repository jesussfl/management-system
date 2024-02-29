'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Renglon } from '@prisma/client'

type FormValues = Omit<Renglon, 'id'>
export const createItem = async (data: FormValues) => {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('You must be signed in to perform this action')
    }
    const { nombre } = data
    const exist = await prisma.renglon.findUnique({
      where: {
        nombre,
      },
    })
    if (exist) {
      throw new Error('Renglon already exists')
    }
    console.log('data', data)
    await prisma.renglon.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: data.tipo,
        stock_minimo: data.stock_minimo,
        stock_maximo: data.stock_maximo,
        numero_parte: data.numero_parte,

        clasificacion: {
          connect: {
            id: data.clasificacionId,
          },
        },

        categoria: {
          connect: {
            id: data.categoriaId,
          },
        },

        unidad_empaque: {
          connect: {
            id: data.unidadEmpaqueId,
          },
        },
      },
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

    await prisma.renglon.update({
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

  await prisma.renglon.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/recepciones')
}
export const checkItemExistance = async (name: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  if (!name) {
    return false
  }

  const exists = await prisma.renglon.findUnique({
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
  const renglones = await prisma.renglon.findMany({
    include: {
      recepciones: true,
      clasificacion: true,
      unidad_empaque: true,
      categoria: true,
    },
  })
  return renglones
}
