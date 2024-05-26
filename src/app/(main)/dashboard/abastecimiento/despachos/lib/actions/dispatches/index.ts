'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import {
  Despacho,
  Despachos_Renglones,
  Destinatario,
  Prisma,
  Profesional_Abastecimiento,
} from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { registerAuditAction } from '@/lib/actions/audit'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import getGuideCode from '@/utils/helpers/get-guide-code'

type DestinatarioWithRelations = Prisma.DestinatarioGetPayload<{
  include: {
    grado: true
    categoria: true
    componente: true
    unidad: true
  }
}>

type Detalles = Omit<
  Despachos_Renglones,
  'id_despacho' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}

export type FormValues = Omit<
  Despacho,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  destinatario: DestinatarioWithRelations
  supervisor?: Profesional_Abastecimiento
  abastecedor?: Profesional_Abastecimiento
  autorizador?: Profesional_Abastecimiento
  renglones: Detalles[]
}
export const createDispatch = async (data: FormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESPACHOS,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { motivo, fecha_despacho, cedula_destinatario, renglones } = data

  if (!fecha_despacho || !renglones) {
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
      success: false,

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
        success: false,

        fields: [item.id_renglon],
      }
    }

    serials.push(...serialsByItem)
  }

  await prisma.despacho.create({
    data: {
      servicio: 'Abastecimiento',
      cedula_destinatario,
      cedula_abastecedor: data.cedula_abastecedor,
      cedula_supervisor: data.cedula_supervisor,
      cedula_autorizador: data.cedula_autorizador,
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

  await registerAuditAction(`Se realizó un despacho con motivo: ${motivo}`)

  revalidatePath('/dashboard/abastecimiento/despachos')

  return {
    success: true,
    error: false,
  }
}

export const updateDispatch = async (id: number, data: FormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESPACHOS,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { motivo, fecha_despacho, cedula_destinatario, renglones } = data

  if (!fecha_despacho || !renglones) {
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
      success: false,

      fields: fields,
    }
  }

  const items = data.renglones
  const currentDispatch = await prisma.despacho.findUnique({
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
  const currentDispatchedSerials = currentDispatch?.renglones
    .flatMap((renglon) => renglon.seriales)
    .map((serial) => ({
      id_renglon: serial.id_renglon,
      serial: serial.serial,
    }))
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
        success: false,

        fields: [item.id_renglon],
      }
    }

    serials.push(...serialsByItem)
  }

  renglones.forEach((renglon) => {
    // @ts-ignore
    delete renglon.id
  })

  await prisma.despacho.update({
    where: {
      id,
    },
    data: {
      cedula_destinatario,
      cedula_abastecedor: data.cedula_abastecedor,
      cedula_supervisor: data.cedula_supervisor,
      cedula_autorizador: data.cedula_autorizador,
      motivo,
      fecha_despacho,

      renglones: {
        deleteMany: {},
        create: renglones.map((renglon) => ({
          manualSelection: renglon.manualSelection,
          observacion: renglon.observacion,
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
        in: currentDispatchedSerials?.map((serial) => serial.serial),
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
      estado: 'Despachado',
    },
  })

  await registerAuditAction(`Se actualizó un despacho con motivo: ${motivo}`)

  revalidatePath('/dashboard/abastecimiento/despachos')

  return {
    success: true,
    error: false,
  }
}
export const deleteDispatch = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const exist = await prisma.despacho.findUnique({
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
    return {
      error: 'Despacho no existe',
      success: false,
    }
  }

  await prisma.despacho.delete({
    where: {
      id: id,
    },
  })

  await prisma.serial.updateMany({
    where: {
      id_renglon: {
        in: exist.renglones.flatMap((renglon) =>
          renglon.seriales.map((serial) => serial.id_renglon)
        ),
      },
    },
    data: {
      estado: 'Disponible',
    },
  })
  await registerAuditAction(`Se eliminó el despacho con id: ${id}`)
  revalidatePath('/dashboard/abastecimiento/despachos')

  return {
    success: true,
    error: false,
  }
}
export const getAllDispatches = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const dispatch = await prisma.despacho.findMany({
    where: {
      servicio: 'Abastecimiento',
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
      supervisor: true,
      abastecedor: true,
      autorizador: true,
    },
  })
  return dispatch
}

export const getDispatchById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const dispatch = await prisma.despacho.findUnique({
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
              unidad_empaque: true,
              recepciones: true,
              clasificacion: true,
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

  if (!dispatch) {
    throw new Error('Despacho no existe')
  }

  // @ts-ignore
  return {
    ...dispatch,

    renglones: dispatch.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
  }
}

export const getDispatchForExportGuide = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const dispatchData = await prisma.despacho.findUnique({
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
              unidad_empaque: true,
              recepciones: true,
              clasificacion: true,
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

  if (!dispatchData) {
    throw new Error('Despacho no existe')
  }

  return {
    destinatario_cedula: `${dispatchData.destinatario.tipo_cedula}-${dispatchData.cedula_destinatario}`,
    destinatario_nombres: dispatchData.destinatario.nombres,
    destinatario_apellidos: dispatchData.destinatario.apellidos,
    destinatario_grado: dispatchData?.destinatario?.grado?.nombre || 's/c',
    destinatario_cargo: dispatchData.destinatario.cargo_profesional || 's/c',
    destinatario_telefono: dispatchData.destinatario.telefono,
    despacho: dispatchData,
    renglones: dispatchData.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
    autorizador: dispatchData.autorizador,
    abastecedor: dispatchData.abastecedor,
    supervisor: dispatchData.supervisor,
    unidad: dispatchData?.destinatario?.unidad?.nombre || 's/u',
    codigo: getGuideCode(dispatchData.id),
    motivo: dispatchData.motivo || 's/m',
  }
}

export const deleteMultipleDispatches = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESPACHOS,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.despacho.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(`Se han eliminado los siguientes despachos ${ids}`)
  revalidatePath('/dashboard/abastecimiento/despachos')

  return {
    success: 'Se han eliminado los despachos correctamente',
    error: false,
  }
}
