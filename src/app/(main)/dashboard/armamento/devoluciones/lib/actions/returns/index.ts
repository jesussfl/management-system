'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Devolucion, Devoluciones_Renglones, Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
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
type ReturnType = Prisma.DevolucionGetPayload<{
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
export type FormValues = Omit<
  Devolucion,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  destinatario: DestinatarioWithRelations
  renglones: Detalles[]
}
export const createReturn = async (data: FormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const { motivo, fecha_devolucion, cedula_destinatario, renglones } = data
  console.log(cedula_destinatario, 'cedula_destinatario')
  if (!fecha_devolucion || !renglones) {
    return {
      error: 'Missing Fields',
      success: false,
    }
  }

  if (renglones.length === 0) {
    return {
      error: 'No se han seleccionado renglones',
      success: false,
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
      cedula_abastecedor: data.cedula_abastecedor,
      cedula_autorizador: data.cedula_autorizador,
      cedula_supervisor: data.cedula_supervisor,
      motivo,
      fecha_devolucion,
      servicio: 'Armamento',
      renglones: {
        create: renglones.map((renglon) => ({
          ...renglon,
          id_renglon: renglon.id_renglon,

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

  await registerAuditAction(`Devolucion creada con motivo: ${motivo}`)
  revalidatePath('/dashboard/armamento/devoluciones')

  return {
    success: true,
    error: false,
  }
}

export const updateReturn = async (id: number, data: FormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { motivo, fecha_devolucion, cedula_destinatario, renglones } = data

  if (!fecha_devolucion || !renglones) {
    return {
      error: 'Missing Fields',
      success: false,
    }
  }

  if (renglones.length === 0) {
    return {
      error: 'No se han seleccionado renglones',
      success: false,
    }
  }

  const items = data.renglones

  const currentReturn = await prisma.devolucion.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          seriales: true,
        },
      },
    },
  })

  if (!currentReturn) {
    return {
      error: 'Devolucion no encontrada',
      success: false,
    }
  }

  const serialsByReturn = currentReturn.renglones
    .flatMap((renglon) => renglon.seriales)
    .map((serial) => ({ id_renglon: serial.id_renglon, serial: serial.serial }))

  const serials: { id_renglon: number; serial: string }[] = []
  for (const item of items) {
    const serialsByItem = item.seriales.map((serial) => ({
      id_renglon: item.id_renglon,
      serial,
    }))
    serials.push(...serialsByItem)
    continue
  }
  renglones.forEach((renglon) => {
    // @ts-ignore
    delete renglon.id
  })
  //create a const where the serials are not in the current return
  // const serialsToUpdate = serials.filter(
  //   (serial) =>
  //     !serialsByReturn.some(
  //       (serialByReturn) => serialByReturn.serial === serial.serial
  //     )
  // )
  await prisma.devolucion.update({
    where: {
      id,
    },
    data: {
      cedula_destinatario,
      motivo,
      fecha_devolucion,

      renglones: {
        deleteMany: {},
        create: renglones.map((renglon) => ({
          id_renglon: renglon.id_renglon,

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
        in: serialsByReturn?.map((serial) => serial.serial),
      },
    },
    data: {
      estado: 'Disponible',
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

  await registerAuditAction(`Devolucion actualizada con motivo: ${motivo}`)
  revalidatePath('/dashboard/armamento/devoluciones')

  return {
    success: true,
    error: false,
  }
}

export const deleteReturn = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.devolucion.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          seriales: true,
        },
      },
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

  await prisma.serial.updateMany({
    where: {
      serial: {
        in: exist.renglones
          .flatMap((renglon) => renglon.seriales)
          .filter((serial) => serial.estado === 'Devuelto')
          .map((serial) => serial.serial),
      },
    },
    data: {
      estado: 'Disponible',
    },
  })
  await registerAuditAction(`Devolucion eliminada con motivo: ${exist.motivo}`)
  revalidatePath('/dashboard/armamento/devoluciones')

  return {
    success: 'Devolucion eliminada correctamente',
    error: false,
  }
}

export const getAllReturns = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const devolution = await prisma.devolucion.findMany({
    where: {
      servicio: 'Armamento',
    },
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

export const getReturnById = async (id: number): Promise<ReturnType> => {
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
              clasificacion: true,
              categoria: true,
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

  return {
    ...devolution,

    //@ts-ignore
    renglones: devolution.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
  }
}
