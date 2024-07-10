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
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import getGuideCode from '@/utils/helpers/get-guide-code'
type SerialType = Omit<
  Serial,
  'id' | 'id_recepcion' | 'fecha_creacion' | 'ultima_actualizacion'
>

type Detalles = Omit<
  Recepciones_Renglones,
  'id_recepcion' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: SerialType[]
}
export type RecepcionType = Prisma.RecepcionGetPayload<{
  include: {
    destinatario: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    supervisor: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    abastecedor: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    autorizador: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
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
        seriales: {
          select: {
            serial: true
          }
        }
      }
    }
  }
}>
type FormValues = Omit<
  Recepcion,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
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
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { motivo, fecha_recepcion, renglones } = data

  if (!fecha_recepcion || !renglones) {
    return {
      error: 'Missing Fields',
      success: false,
      fields: [],
    }
  }

  if (allSerialsAreValid(renglones)) {
    const fields = getAffectedFields(renglones)

    return {
      error: 'Hay algunos renglones sin seriales',
      fields: fields,
      success: false,
    }
  }

  const recepcion = await prisma.recepcion.create({
    data: {
      ...data,
      motivo,
      servicio: 'Abastecimiento',
      fecha_recepcion,
      renglones: {
        create: renglones.map((renglon) => ({
          ...renglon,
          seriales: {
            create: renglon.seriales.map((serial) => ({
              serial: serial.serial,
              renglon: {
                connect: {
                  id: renglon.id_renglon,
                },
              },
            })),
          },
        })),
      },
    },
  })

  await registerAuditAction(
    `Se creó una recepción de abastecimiento con motivo: ${data.motivo} y el id ${recepcion.id}`
  )
  revalidatePath('/dashboard/abastecimiento/recepciones')

  return {
    success: 'Recepcion creada exitosamente',
    error: false,
    fields: [],
  }
}

export const updateReception = async (id: number, data: FormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const reception = await prisma.recepcion.findUnique({
    where: {
      id,
    },
  })

  if (!reception) {
    return {
      error: 'Recepcion no existe',
      success: false,
    }
  }
  if (allSerialsAreValid(data.renglones)) {
    const fields = getAffectedFields(data.renglones)

    return {
      error: 'Hay algunos renglones sin seriales',
      success: false,
      fields: fields,
    }
  }

  await prisma.recepcion.update({
    where: {
      id,
    },
    data: {
      fecha_recepcion: data.fecha_recepcion,
      motivo: data.motivo,
      cedula_abastecedor: data.cedula_abastecedor,
      cedula_autorizador: data.cedula_autorizador,
      cedula_destinatario: data.cedula_destinatario,
      cedula_supervisor: data.cedula_supervisor,
      renglones: {
        deleteMany: {},
        create: data.renglones.map((renglon) => ({
          ...renglon,

          id: undefined,
          id_recepcion: undefined,
          id_renglon: undefined,
          codigo_solicitud: undefined,
          pedido: renglon.codigo_solicitud
            ? {
                connect: {
                  id: renglon.codigo_solicitud,
                },
              }
            : undefined,
          renglon: {
            connect: {
              id: renglon.id_renglon,
            },
          },
          seriales: {
            create: renglon.seriales.map((serial) => ({
              serial: serial.serial,
              renglon: {
                connect: {
                  id: renglon.id_renglon,
                },
              },
            })),
          },
        })),
      },
    },
  })

  await registerAuditAction(
    `Se actualizó una recepción de abastecimiento con motivo: ${data.motivo} y el id ${reception.id}`
  )
  revalidatePath('/dashboard/abastecimiento/recepciones')

  return {
    success: 'Recepcion actualizada exitosamente',
    error: false,
  }
}

export const getAllReceptions = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const recepciones = await prisma.recepcion.findMany({
    where: {
      servicio: 'Abastecimiento',
    },
    include: {
      renglones: {
        include: {
          renglon: true,
        },
      },
      abastecedor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      autorizador: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      supervisor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      destinatario: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
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
      destinatario: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      supervisor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      abastecedor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      autorizador: {
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
              recepciones: true,
              unidad_empaque: true,
              clasificacion: true,
              categoria: true,
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

  if (!reception) {
    throw new Error('Recepcion no existe')
  }

  return reception
}

export const deleteReception = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.RECEPCIONES_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.recepcion.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La recepción no existe',
      success: null,
    }
  }

  await prisma.recepcion.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    `Se eliminó la recepción de abastecimiento con motivo: ${exist?.motivo} y el id ${id}`
  )
  revalidatePath('/dashboard/abastecimiento/recepciones')

  return {
    error: null,
    success: 'Recepción eliminada exitosamente',
  }
}
export const deleteMultipleReceptions = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.RECEPCIONES_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.recepcion.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    `Se han eliminado las siguientes recepciones de abastecimiento con los ids: ${ids}`
  )
  revalidatePath('/dashboard/abastecimiento/recepciones')

  return {
    success: 'Se ha eliminado la recepción correctamente',
    error: false,
  }
}

export const getAllOrdersByItemId = async (itemId: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const orders = await prisma.pedido.findMany({
    where: {
      servicio: 'Abastecimiento',
      renglones: {
        some: {
          id_renglon: itemId,
        },
      },
    },
  })
  return orders
}

export const getReceptionForExportGuide = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const receptionData = await prisma.recepcion.findUnique({
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
      supervisor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      abastecedor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      autorizador: {
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
              recepciones: true,
              unidad_empaque: true,
              clasificacion: true,
              categoria: true,
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

  if (!receptionData) {
    throw new Error('Despacho no existe')
  }

  return {
    destinatario_cedula: `${receptionData.destinatario?.tipo_cedula}-${receptionData.cedula_destinatario}`,
    destinatario_nombres: receptionData.destinatario?.nombres || 'Sin nombres',
    destinatario_apellidos:
      receptionData.destinatario?.apellidos || 'Sin apellidos',
    destinatario_grado: receptionData?.destinatario?.grado?.nombre || 's/g',
    destinatario_cargo: receptionData.destinatario?.cargo_profesional || 's/c',
    destinatario_telefono: receptionData.destinatario?.telefono || 's/t',
    recepcion: receptionData,
    renglones: receptionData.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
    autorizador: receptionData.autorizador,
    abastecedor: receptionData.abastecedor,
    supervisor: receptionData.supervisor,
    unidad: receptionData?.destinatario?.unidad?.nombre || 's/u',
    codigo: getGuideCode(receptionData.id),
    motivo: receptionData.motivo || 's/m',
  }
}
