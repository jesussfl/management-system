'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getStatistics = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const items = await prisma.renglon.count()
  const users = await prisma.usuario.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), 0, 1),
        lte: new Date(new Date().getFullYear(), 11, 31),
      },
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      createdAt: true,
    },
  })
  const dispatches = await prisma.despacho.count()
  const receptions = await prisma.recepcion.count()
  return { items, users, dispatches, receptions }
}

type DispatchesParams = {
  from?: Date
  to?: Date
}
export const getDispatchesStats = async ({ from, to }: DispatchesParams) => {
  console.log(from, to)
  const dispatches = await prisma.despacho.findMany({
    where: {
      fecha_creacion: {
        gte: from,
        lte: to,
      },
    },
    select: {
      id: true,
      renglones: {
        select: {
          seriales: true,
          renglon: {
            select: {
              nombre: true,
            },
          },
        },
      },
      fecha_creacion: true,
    },
  })
  return dispatches
}

export const getUserStats = async ({ from, to }: DispatchesParams) => {
  const users = await prisma.usuario.findMany({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      createdAt: true,
    },
  })
  return users
}
