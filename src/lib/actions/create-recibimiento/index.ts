'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
type Detalles = {
  id_renglon: number
  cantidad: number
  fecha_fabricacion: Date
  fecha_vencimiento: Date
}

type FormValues = {
  fecha_recepcion: Date
  motivo: string
  detalles: Detalles[]
}

export const createRecibimiento = async (data: FormValues) => {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new Error('You must be signed in to perform this action.')
    }

    const { motivo, fecha_recepcion, detalles } = data

    if (!fecha_recepcion || !detalles) {
      return {
        error: 'Missing Fields',
      }
    }
    await prisma.recepcion.create({
      data: {
        motivo,
        fecha_recepcion,
        renglones: {
          create: detalles,
        },
      },
    })
    revalidatePath('/dashboard/abastecimiento/recepciones')
  } catch (error) {
    console.log(error)
  }
}
