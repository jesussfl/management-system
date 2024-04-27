'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Devolucion, Devoluciones_Renglones, Prisma } from '@prisma/client'
type DestinatarioWithRelations = Prisma.DestinatarioGetPayload<{
  include: {
    grado: true
    categoria: true
    componente: true
    unidad: true
  }
}>
type Detalles = Omit<
  Devoluciones_Renglones,
  'id_devolucion' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}

export type FormValues = Omit<
  Devolucion,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  destinatario: DestinatarioWithRelations
  renglones: Detalles[]
}
export const createReturn = async (data: FormValues) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  const { motivo, fecha_devolucion, cedula_destinatario, renglones } = data

  if (!fecha_devolucion || !renglones) {
    return {
      error: 'Missing Fields',
    }
  }

  if (renglones.length === 0) {
    return {
      error: 'No se han seleccionado renglones',
    }
  }

  const items = data.renglones
  const serials: { id_renglon: number; serial: string }[] = []
  for (const item of items) {
    const serialsByItem = item.seriales.map((serial) => ({
      id_renglon: item.id_renglon,
      serial,
    }))
    serials.push(...serialsByItem)
    continue
  }

  await prisma.devolucion.create({
    data: {
      cedula_destinatario,
      motivo,
      fecha_devolucion,

      renglones: {
        create: renglones.map((renglon) => ({
          ...renglon,
          id_renglon: renglon.id_renglon,
          // cantidad: serials.filter(
          //   (serial) => serial.id_renglon === renglon.id_renglon
          // ).length,
          seriales: {
            connect: serials
              .filter((serial) => serial.id_renglon === renglon.id_renglon)
              .map((serial) => ({ serial: serial.serial })),
          },
        })),
      },
    },
  })

  await prisma.serial.updateMany({
    where: {
      serial: {
        in: serials.map((serial) => serial.serial),
      },
    },
    data: {
      estado: 'Devuelto',
    },
  })

  revalidatePath('/dashboard/abastecimiento/devoluciones')

  return {
    success: true,
  }
}
export const deleteReturn = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  const exist = await prisma.devolucion.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    throw new Error('Devolucion no existe')
  }

  await prisma.devolucion.delete({
    where: {
      id: id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/devoluciones')
}
export const getAllReturns = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const devolution = await prisma.devolucion.findMany({
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
  return devolution
}

export const getReturnById = async (id: number): Promise<FormValues> => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const devolution = await prisma.devolucion.findUnique({
    where: {
      id,
    },
    include: {
      destinatario: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },

      renglones: {
        include: {
          renglon: {
            include: {
              unidad_empaque: true,
              recepciones: true,
              despachos: {
                include: {
                  seriales: true,
                },
              },
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

  if (!devolution) {
    throw new Error('Despacho no existe')
  }

  // @ts-ignore
  //TODO: fix this ts-ignore
  return {
    ...devolution,

    renglones: devolution.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
  }
}
