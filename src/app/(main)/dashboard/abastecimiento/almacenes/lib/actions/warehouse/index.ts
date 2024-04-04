'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Almacen } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllWarehouses = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const warehouses = await prisma.almacen.findMany()

  return warehouses
}

export const getWarehouseById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const warehouse = await prisma.almacen.findUnique({
    where: {
      id,
    },
  })

  if (!warehouse) {
    throw new Error('Warehouse not found')
  }

  return warehouse
}

export const createWarehouse = async (data: Omit<Almacen, 'id'>) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
      field: 'nombre',
    }
  }

  await prisma.almacen.create({
    data,
  })

  revalidatePath('/dashboard/abastecimiento/almacenes')
  return {
    success: 'Almacen creado exitosamente',
  }
}

export const updateWarehouse = async (
  id: number,
  data: Omit<Almacen, 'id'>
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.almacen.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath('/dashboard/abastecimiento/almacenes')
  return {
    success: 'Almacen actualizado exitosamente',
  }
}
