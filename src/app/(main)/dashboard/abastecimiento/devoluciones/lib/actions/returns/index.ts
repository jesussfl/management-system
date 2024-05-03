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
    sectionName: SECTION_NAMES.DEVOLUCIONES,
    actionName: 'CREAR',
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
  revalidatePath('/dashboard/abastecimiento/devoluciones')

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
    sectionName: SECTION_NAMES.DEVOLUCIONES,
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
  })

  if (!exist) {
    throw new Error('Devolucion no existe')
  }

  await prisma.devolucion.delete({
    where: {
      id: id,
    },
  })

  await registerAuditAction(`Devolucion eliminada con motivo: ${exist.motivo}`)
  revalidatePath('/dashboard/abastecimiento/devoluciones')

  return {
    success: true,
    error: false,
  }
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
