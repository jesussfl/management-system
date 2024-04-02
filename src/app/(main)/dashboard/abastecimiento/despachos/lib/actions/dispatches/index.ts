'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import {
  Despacho,
  Despachos_Renglones,
  Prisma,
  Recepcion,
  Recepciones_Renglones,
  Serial,
} from '@prisma/client'
type SerialType = Omit<Serial, 'id_recepcion' | 'id_despacho' | 'estado'>

type Detalles = Omit<
  Despachos_Renglones,
  'id_despacho' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}

type FormValues = Omit<
  Despacho,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  renglones: Detalles[]
}
export const createDispatch = async (data: FormValues) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  const { motivo, fecha_despacho, cedula_destinatario, renglones } = data

  if (!fecha_despacho || !renglones) {
    return {
      error: 'Missing Fields',
    }
  }
  if (renglones.some((renglon, index) => renglon.seriales.length === 0)) {
    const fields = renglones
      .filter((renglon) => renglon.seriales.length === 0)
      .map((renglon, index) => renglon.id_renglon)

    return {
      error: 'Revisa que todos los renglones esten correctamente seleccionados',
      fields: fields,
    }
  }
  const serials = data.renglones.flatMap((renglon) => renglon.seriales)

  await prisma.despacho.create({
    data: {
      cedula_destinatario,
      motivo,
      fecha_despacho,
      renglones: {
        create: renglones.map((renglon) => ({
          ...renglon,
          id_renglon: renglon.id_renglon,
          seriales: {
            connect: renglon.seriales.map((serial) => ({
              serial: serial,
            })),
          },
        })),
      },
    },
  })

  await prisma.serial.updateMany({
    where: {
      serial: {
        in: serials,
      },
    },
    data: {
      estado: 'Despachado',
    },
  })
  revalidatePath('/dashboard/abastecimiento/despachos')
}
export const deleteDispatch = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  const exist = await prisma.despacho.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    throw new Error('Despacho no existe')
  }

  await prisma.despacho.delete({
    where: {
      id: id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/despachos')
}
export const getAllDispatches = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const dispatch = await prisma.despacho.findMany({
    include: {
      renglones: {
        include: {
          renglon: {
            include: {
              unidad_empaque: true,
            },
          },
          seriales: true,
        },
      },
      destinatario: true,
    },
  })
  return dispatch
}

export const getDispatchById = async (id: number): Promise<FormValues> => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const dispatch = await prisma.despacho.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          renglon: {
            include: {
              unidad_empaque: true,
              recepciones: true,
            },
          },
          seriales: {
            select: {
              serial: true,
            },
          },
        },
      },
    },
  })

  if (!dispatch) {
    throw new Error('Despacho no existe')
  }
  return {
    ...dispatch,
    renglones: dispatch.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
  }
}
