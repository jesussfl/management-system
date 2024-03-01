'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import {
  Prisma,
  Recepcion,
  Recepciones_Renglones,
  Serial,
} from '@prisma/client'
type SerialType = Omit<Serial, 'id' | 'id_recepcion'>

type Detalles = Omit<Recepciones_Renglones, 'id_recepcion' | 'id'> & {
  seriales: SerialType[]
}

type FormValues = Omit<Recepcion, 'id'> & {
  renglones: Detalles[]
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
  if (
    renglones.some(
      (renglon, index) =>
        renglon.seriales.length === 0 ||
        renglon.seriales.some(
          (serial) =>
            !serial.serial ||
            serial.serial === '' ||
            serial.serial === undefined
        )
    )
  ) {
    const fields = renglones
      .filter(
        (renglon) =>
          renglon.seriales.length === 0 ||
          renglon.seriales.some(
            (serial) =>
              !serial.serial ||
              serial.serial === '' ||
              serial.serial === undefined
          )
      )
      .map((renglon, index) => renglon.id_renglon)

    return {
      error: 'Hay algunos renglones sin seriales',
      fields: fields,
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
