'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Categoria } from '@prisma/client'
export const createCategory = async (data: Omit<Categoria, 'id'>) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { nombre } = data
  const exist = await prisma.categoria.findUnique({
    where: {
      nombre,
    },
  })
  if (exist) {
    return {
      field: 'nombre',
      error: 'Esta Categoria ya existe',
    }
  }

  await prisma.categoria.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Categoria creada exitosamente',
  }
}

export const updateCategory = async (
  id: number,
  data: Omit<Categoria, 'id'>
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.categoria.update({
    where: {
      id,
    },
    data,
  })
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Categoria actualizada exitosamente',
  }
}

export const deleteCategory = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.categoria.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/inventario')
}
export const getCategoryById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const category = await prisma.categoria.findUnique({
    where: {
      id,
    },
    include: {
      clasificacion: true,
    },
  })

  if (!category) {
    throw new Error('Categoria no existe')
  }

  return category
}
export const getAllCategories = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const categories = await prisma.categoria.findMany({
    include: {
      clasificacion: true,
    },
  })

  return categories
}

export const getCategoriesByClassificationId = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const categories = await prisma.categoria.findMany({
    where: {
      id_clasificacion: id,
    },
  })

  return categories
}