'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma, Recepcion, Recepciones_Renglones } from '@prisma/client'
type RecepcionType = Prisma.RecepcionGetPayload<{
  include: { renglones: true }
}>
type Detalles = Omit<Recepciones_Renglones, 'id_recepcion' | 'id'>

type FormValues = Omit<Recepcion, 'id'> & {
  renglones: Detalles[] & {
    seriales: {
      serial: string
    }
  }
}
export const createReception = async (data: FormValues) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  const { motivo, fecha_recepcion, renglones } = data

  if (!fecha_recepcion || !renglones) {
    return {
      error: 'Missing Fields',
    }
  }
  await prisma.recepcion.create({
    data: {
      motivo,
      fecha_recepcion,
      renglones: {
        create: renglones.map((renglon) => ({
          ...renglon,
          seriales: {
            create: renglon.seriales,
          },
        })),
      },
    },
  })
  revalidatePath('/dashboard/abastecimiento/recepciones')
}
export const getAllReceptions = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const recepciones = await prisma.recepcion.findMany({
    include: {
      renglones: {
        include: {
          renglon: true,
        },
      },
    },
  })
  return recepciones
}
