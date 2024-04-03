'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Despacho, Despachos_Renglones } from '@prisma/client'

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

  if (renglones.length === 0) {
    return {
      error: 'No se han seleccionado renglones',
    }
  }
  if (
    renglones.some(
      (renglon) => renglon.seriales.length === 0 && renglon.manualSelection
    )
  ) {
    const fields = renglones
      .filter(
        (renglon) => renglon.seriales.length === 0 && renglon.manualSelection
      )
      .map((renglon) => renglon.id_renglon)

    return {
      error: 'Revisa que todos los renglones esten correctamente',
      fields: fields,
    }
  }

  const items = data.renglones
  const serials: { id_renglon: number; serial: string }[] = []
  for (const item of items) {
    if (item.manualSelection) {
      const serialsByItem = item.seriales.map((serial) => ({
        id_renglon: item.id_renglon,
        serial,
      }))
      serials.push(...serialsByItem)
      continue
    }
    const serialsByItem = await prisma.serial.findMany({
      where: {
        id_renglon: item.id_renglon,
        AND: {
          estado: 'Disponible',
        },
      },
      select: {
        id_renglon: true,
        serial: true,
      },
      take: item.cantidad,
    })

    if (serialsByItem.length < item.cantidad) {
      return {
        error: 'No hay suficientes seriales',
        fields: [item.id_renglon],
      }
    }

    serials.push(...serialsByItem)
  }

  await prisma.despacho.create({
    data: {
      cedula_destinatario,
      motivo,
      fecha_despacho,
      renglones: {
        create: renglones.map((renglon) => ({
          ...renglon,
          id_renglon: renglon.id_renglon,
          cantidad: serials.filter(
            (serial) => serial.id_renglon === renglon.id_renglon
          ).length,
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
      estado: 'Despachado',
    },
  })

  revalidatePath('/dashboard/abastecimiento/despachos')

  return {
    success: true,
  }
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
