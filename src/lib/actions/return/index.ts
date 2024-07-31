'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { format } from 'date-fns'
import { ReturnFormValues } from '../../../app/(main)/dashboard/abastecimiento/devoluciones/lib/types/types'

export const createReturn = async (
  data: ReturnFormValues,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.DEVOLUCIONES_ABASTECIMIENTO
        : SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
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

  const newReturn = await prisma.devolucion.create({
    data: {
      cedula_destinatario,
      cedula_abastecedor: data.cedula_abastecedor,
      cedula_autorizador: data.cedula_autorizador,
      cedula_supervisor: data.cedula_supervisor,
      motivo,
      fecha_devolucion,
      servicio,
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
  await registerAuditAction(
    'CREAR',
    `Se creó una devolución en ${servicio.toLowerCase()} con el siguiente motivo: ${motivo}. El ID de la devolución es: ${
      newReturn.id
    }, ${
      data.motivo_fecha
        ? `, la fecha de creación fue: ${format(
            newReturn.fecha_creacion,
            'dd-MM-yyyy HH:mm'
          )}, la fecha de devolucion: ${format(
            newReturn.fecha_devolucion,
            'dd-MM-yyyy HH:mm'
          )}, motivo de la fecha: ${data.motivo_fecha}`
        : ''
    } `
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/devoluciones`)

  return {
    success: 'Devolución creada correctamente',
    error: false,
  }
}

export const updateReturn = async (
  id: number,
  data: ReturnFormValues,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.DEVOLUCIONES_ABASTECIMIENTO
        : SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
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
  const updatedReturn = await prisma.devolucion.update({
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

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizo una devolución en ${servicio.toLowerCase()} con el siguiente motivo: ${motivo}. El ID de la devolución es: ${
      updatedReturn.id
    } ${
      data.motivo_fecha
        ? `, la fecha de creación fue: ${format(
            updatedReturn.fecha_creacion,
            'dd-MM-yyyy HH:mm'
          )}, la fecha de devolucion: ${format(
            updatedReturn.fecha_devolucion,
            'dd-MM-yyyy HH:mm'
          )}, motivo de la fecha: ${data.motivo_fecha}`
        : ''
    }  `
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/devoluciones`)

  return {
    success: true,
    error: false,
  }
}

export const deleteReturn = async (
  id: number,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.DEVOLUCIONES_ABASTECIMIENTO
        : SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
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
          .filter(
            (serial) =>
              serial.estado === 'Devuelto' || serial.estado === 'Despachado'
          )
          .map((serial) => serial.serial),
      },
    },
    data: {
      estado: 'Despachado',
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se eliminó la devolución en ${servicio.toLowerCase()} con el siguiente motivo: ${
      exist.motivo
    }. El ID de la devolución es: ${exist.id} `
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/devoluciones`)

  return {
    success: 'Devolucion eliminada correctamente',
    error: false,
  }
}
export const recoverReturn = async (
  id: number,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.DEVOLUCIONES_ABASTECIMIENTO
        : SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
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

  await prisma.devolucion.update({
    where: {
      id: id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  //TODO: REVISAR ESTO
  await prisma.serial.updateMany({
    where: {
      serial: {
        in: exist.renglones
          .flatMap((renglon) => renglon.seriales)
          .filter(
            (serial) =>
              serial.estado === 'Despachado' || serial.estado === 'Devuelto'
          )
          .map((serial) => serial.serial),
      },
    },
    data: {
      estado: 'Devuelto',
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    `Se recuperó la devolución en ${servicio.toLowerCase()} con el siguiente motivo: ${
      exist.motivo
    }. El ID de la devolución es: ${exist.id} `
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/devoluciones`)

  return {
    success: 'Devolucion recuperada correctamente',
    error: false,
  }
}
export const getAllReturns = async (
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const devolution = await prisma.devolucion.findMany({
    orderBy: {
      ultima_actualizacion: 'desc',
    },
    where: {
      servicio,
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

export const getReturnById = async (id: number) => {
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

  if (!devolution) {
    throw new Error('Devolucion no existe')
  }

  return {
    ...devolution,

    renglones: devolution.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
  }
}
