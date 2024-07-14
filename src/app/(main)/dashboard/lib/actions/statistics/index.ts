'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getStatistics = async (
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const items = await prisma.renglon.count({
    where: {
      servicio: 'Abastecimiento',
    },
  })
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
  const dispatches = await prisma.despacho.count({
    where: {
      servicio,
    },
  })
  const receptions = await prisma.recepcion.count({
    where: {
      servicio,
    },
  })
  const devolutions = await prisma.devolucion.count({
    where: {
      servicio,
    },
  })
  const pedidos = await prisma.pedido.count({
    where: {
      servicio,
    },
  })
  return { items, users, dispatches, receptions, devolutions, pedidos }
}

type DispatchesParams = {
  from?: Date
  to?: Date
  servicio: 'Abastecimiento' | 'Armamento'
}
export const getDispatchesStats = async ({
  from,
  to,
  servicio,
}: DispatchesParams) => {
  console.log(from, to)
  const dispatches = await prisma.despacho.findMany({
    where: {
      servicio,
      AND: {
        fecha_creacion: {
          gte: from,
          lte: to,
        },
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
