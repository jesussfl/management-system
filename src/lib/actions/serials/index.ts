'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getAllSerials = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.findMany()
  return serials
}

export const getSerialsByItem = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.findMany({
    where: {
      recepcion: {
        id_renglon: id,
      },
    },
  })

  return serials.map((serial) => serial.serial)
}
