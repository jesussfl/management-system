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
type RecepcionType = Prisma.RecepcionGetPayload<{
  include: {
    renglones: {
      include: {
        renglon: {
          include: {
            clasificacion: true
            categoria: true
            recepciones: true
            unidad_empaque: true
          }
        }
        seriales: true
      }
    }
  }
}>
type FormValues = Omit<Recepcion, 'id'> & {
  renglones: Detalles[]
}

const allSerialsAreValid = (renglones: Detalles[]) => {
  return renglones.some(
    (renglon, index) =>
      renglon.seriales.length === 0 ||
      renglon.seriales.some(
        (serial) =>
          !serial.serial || serial.serial === '' || serial.serial === undefined
      )
  )
}
const getAffectedFields = (renglones: Detalles[]) => {
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

  return fields
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

  if (allSerialsAreValid(renglones)) {
    const fields = getAffectedFields(renglones)

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
            create: renglon.seriales.map((serial) => ({
              serial: serial.serial,
            })),
          },
        })),
      },
    },
  })
  revalidatePath('/dashboard/abastecimiento/recepciones')
}

export const updateReception = async (id: number, data: FormValues) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const reception = await prisma.recepcion.findUnique({
    where: {
      id,
    },
  })

  if (!reception) {
    return {
      error: 'Recepcion no existe',
    }
  }
  if (allSerialsAreValid(data.renglones)) {
    const fields = getAffectedFields(data.renglones)

    return {
      error: 'Hay algunos renglones sin seriales',
      fields: fields,
    }
  }
  await prisma.recepcion.update({
    where: {
      id,
    },
    data: {
      ...data,
      renglones: {
        deleteMany: {},
        create: data.renglones.map((renglon) => ({
          ...renglon,

          id: undefined,
          id_recepcion: undefined,
          id_renglon: undefined,

          renglon: {
            connect: {
              id: renglon.id_renglon,
            },
          },
          seriales: {
            create: renglon.seriales.map((serial) => ({
              serial: serial.serial,
            })),
          },
        })),
      },
    },
  })

  revalidatePath('/dashboard/abastecimiento/recepciones')

  return {
    success: 'Recepcion actualizada exitosamente',
  }
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

export const getReceptionById = async (id: number): Promise<RecepcionType> => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const reception = await prisma.recepcion.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          renglon: {
            include: {
              recepciones: true,
              unidad_empaque: true,
              clasificacion: true,
              categoria: true,
            },
          },
          seriales: true,
        },
      },
    },
  })

  if (!reception) {
    throw new Error('Recepcion no existe')
  }

  return reception
}
