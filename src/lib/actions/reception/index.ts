'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import {
  Abreviations,
  SECTION_NAMES,
} from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import getGuideCode from '@/utils/helpers/get-guide-code'
import { format } from 'date-fns'
import {
  Recepcion_RenglonesFormValues,
  ReceptionFormValues,
} from '../../types/reception-types'
import { validateUserAndPermissions } from '@/utils/helpers/validate-user-and-permissions'

export const createReception = async (
  data: ReceptionFormValues,
  servicio: 'Armamento' | 'Abastecimiento'
) => {
  await validateUserAndPermissions(
    servicio === 'Abastecimiento'
      ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
      : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    'CREAR'
  )
  const receptionItems = data.renglones

  const itemsWithEmptySerials = getItemsWithEmptySerials(receptionItems)

  if (itemsWithEmptySerials.length > 0) {
    return {
      error: 'Hay algunos renglones sin seriales',
      fields: itemsWithEmptySerials,
      success: false,
    }
  }
  console.log('receptionItems', receptionItems)
  await prisma.$transaction(async (prisma) => {
    const reception = await prisma.recepcion.create({
      data: {
        ...data,
        servicio,
        renglones: {
          create: receptionItems.map((item) => ({
            ...item,
            id_renglon: undefined,
            codigo_solicitud: undefined,
            pedido: item.codigo_solicitud
              ? {
                  connect: {
                    id: item.codigo_solicitud,
                  },
                }
              : undefined,
            renglon: {
              connect: {
                id: item.id_renglon,
              },
            },

            seriales: {
              create: item.seriales.map((serial) => ({
                serial: serial.serial,
                condicion: serial.condicion || undefined,
                peso_actual: serial.peso_actual || 0,
                renglon: {
                  connect: {
                    id: item.id_renglon,
                  },
                },
              })),
            },
          })),
        },
      },
    })

    receptionItems.forEach(async (item) => {
      if (item.es_recepcion_liquidos) return
      await prisma.renglon.update({
        where: {
          id: item.id_renglon,
        },
        data: {
          stock_actual: {
            increment: item.seriales.length,
          },
        },
      })
    })

    await registerAuditAction(
      'CREAR',
      `Se creó una recepción de ${servicio.toLowerCase()} con motivo: ${
        data.motivo
      } y id: ${reception.id} ${
        data.motivo_fecha
          ? `, la fecha de creación fue: ${format(
              reception.fecha_creacion,
              'dd-MM-yyyy HH:mm'
            )}, la fecha de recepción: ${format(
              reception.fecha_recepcion,
              'dd-MM-yyyy HH:mm'
            )}, motivo de la fecha: ${data.motivo_fecha}`
          : ''
      }`
    )
  })

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/recepciones`)

  return {
    success: 'Recepcion creada exitosamente',
    error: false,
    fields: [],
  }
}

export const updateReception = async (
  id: number,
  data: ReceptionFormValues,
  servicio: 'Armamento' | 'Abastecimiento'
) => {
  await validateUserAndPermissions(
    servicio === 'Abastecimiento'
      ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
      : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    'ACTUALIZAR'
  )

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

  const itemsWithEmptySerials = getItemsWithEmptySerials(data.renglones)
  if (itemsWithEmptySerials.length > 0) {
    return {
      error: 'Hay algunos renglones sin seriales',
      success: false,
      fields: itemsWithEmptySerials,
    }
  }

  const recepcion = await prisma.recepcion.update({
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
          seriales: undefined,
        })),
      },
    },
  })
  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó una recepción de ${servicio.toLowerCase()} con motivo: ${
      data.motivo
    } y el id ${reception.id}  ${
      data.motivo_fecha
        ? `, la fecha de creación fue: ${format(
            reception.fecha_creacion,
            'dd-MM-yyyy HH:mm'
          )}, la fecha de recepción: ${format(
            reception.fecha_recepcion,
            'dd-MM-yyyy HH:mm'
          )}, motivo de la fecha: ${data.motivo_fecha}`
        : ''
    }`
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/recepciones`)

  return {
    success: 'Recepcion actualizada exitosamente',
    error: false,
  }
}

export const getAllReceptions = async (
  onlyActives?: boolean,
  servicio?: 'Armamento' | 'Abastecimiento'
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const reception = await prisma.recepcion.findMany({
    orderBy: {
      ultima_actualizacion: 'desc',
    },
    where: {
      servicio,
      fecha_eliminacion: onlyActives ? null : undefined,
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
  return reception
}

export const getReceptionById = async (id: number) => {
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
          recepciones_Seriales: {
            include: {
              serial: true,
            },
          },
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
              id_renglon: true,
              condicion: true,
              peso_actual: true,
            },
          },
        },
      },
    },
  })

  if (!reception) {
    throw new Error('Recepcion no existe')
  }

  return {
    ...reception,
    renglones: reception.renglones.map((renglon) => ({
      ...renglon,
      recepciones_Seriales: undefined,
      seriales: renglon.es_recepcion_liquidos
        ? renglon.recepciones_Seriales.map((serial) => {
            return {
              id: serial.serial.id,
              peso_recibido: serial.peso_recibido,
              serial: serial.serial.serial,
              id_renglon: renglon.id_renglon,
              condicion: '',
              peso_actual: renglon.seriales.find(
                (s) => s.serial === serial.serial.serial
              )?.peso_actual,
            }
          })
        : renglon.seriales.map((serial) => {
            return {
              serial: serial.serial,
              id_renglon: renglon.id_renglon,
              condicion: serial.condicion,
              id: undefined,
              peso_actual: undefined,
            }
          }),
    })),
  }
}

export const deleteReception = async (id: number, servicio: string) => {
  await validateUserAndPermissions(
    servicio === 'Abastecimiento'
      ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
      : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    'ELIMINAR'
  )
  const reception = await prisma.recepcion.findUnique({
    where: {
      id,
    },
    select: {
      motivo: true,
      renglones: {
        include: {
          renglon: true,
          seriales: true,
        },
      },
    },
  })

  if (!reception) {
    return {
      error: 'La recepción no existe',
      success: null,
    }
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.recepcion.delete({
      where: {
        id,
      },
    })
    const receptionItems = reception.renglones

    receptionItems.forEach(async (item) => {
      if (item.es_recepcion_liquidos) return

      await prisma.renglon.update({
        where: {
          id: item.id_renglon,
        },
        data: {
          stock_actual: {
            decrement: item.seriales.length,
          },
        },
      })
    })
    await registerAuditAction(
      'ELIMINAR',
      `Se eliminó la recepción de ${servicio.toLowerCase()} con motivo: ${reception.motivo} y el id ${id}`
    )
  })
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/recepciones`)

  return {
    error: null,
    success: 'Recepción eliminada exitosamente',
  }
}
export const recoverReception = async (id: number, servicio: string) => {
  await validateUserAndPermissions(
    servicio === 'Abastecimiento'
      ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
      : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    'ELIMINAR'
  )
  const reception = await prisma.recepcion.findUnique({
    where: {
      id,
    },
    select: {
      motivo: true,
      renglones: {
        include: {
          renglon: true,
          seriales: true,
        },
      },
    },
  })

  if (!reception) {
    return {
      error: 'La recepción no existe',
      success: null,
    }
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.recepcion.update({
      where: {
        id,
      },
      data: {
        fecha_eliminacion: null,
      },
    })
    const receptionItems = reception.renglones

    receptionItems.forEach(async (item) => {
      if (item.es_recepcion_liquidos) return

      await prisma.renglon.update({
        where: {
          id: item.id_renglon,
        },
        data: {
          stock_actual: {
            increment: item.seriales.length,
          },
        },
      })
    })
    await registerAuditAction(
      'RECUPERAR',
      `Se recuperó la recepción de ${servicio.toLowerCase()} con motivo: ${reception?.motivo} y el id ${id}`
    )
  })

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/recepciones`)

  return {
    error: null,
    success: 'Recepción recuperada exitosamente',
  }
}

export const getAllOrdersByItemId = async (
  itemId: number,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const orders = await prisma.pedido.findMany({
    where: {
      fecha_eliminacion: null,
      servicio,
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
  const receptionData = await getReceptionById(id)

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
      renglon: {
        ...renglon.renglon,
        unidad_empaque: {
          ...renglon.renglon.unidad_empaque,
          abreviacion:
            Abreviations[
              renglon.renglon.unidad_empaque?.tipo_medida ||
                renglon.renglon.tipo_medida_unidad
            ] || 's/u',
        },
      },
      cantidad: renglon.es_recepcion_liquidos
        ? renglon.seriales.length
        : renglon.cantidad,

      seriales: renglon.seriales.map(
        (serial) =>
          `${serial.serial} ${serial.peso_actual ? `(${serial.peso_actual})` : ''}`
      ),
    })),
    autorizador: receptionData.autorizador,
    abastecedor: receptionData.abastecedor,
    supervisor: receptionData.supervisor,
    unidad: receptionData?.destinatario?.unidad?.nombre.toUpperCase() || 's/u',
    codigo: getGuideCode(receptionData.id),
    motivo: receptionData.motivo || 's/m',
  }
}

const getItemsWithEmptySerials = (
  renglones: Recepcion_RenglonesFormValues[]
) => {
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
    .map((renglon) => renglon.id_renglon)

  return fields
}
