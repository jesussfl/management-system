'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { PedidoFormValues } from '../../../components/forms/orders-form'

export const getAllOrders = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const pedidos = await prisma.pedido.findMany({
    include: {
      renglones: {
        include: {
          renglon: true,
        },
      },
      abastecedor: true,
      autorizador: true,
      supervisor: true,
      destinatario: true,
      proveedor: true,
      unidad: true,
    },
  })
  return pedidos
}
export const createOrder = async (data: PedidoFormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.pedido.create({
    data: {
      ...data,
      renglones: {
        create: data.renglones.map((renglon) => ({
          ...renglon,
        })),
      },
    },
  })

  await registerAuditAction(
    `Se creó un nuevo pedido con el siguient motivo: ${data.motivo} y para la fecha: ${data.fecha_solicitud}`
  )
  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    success: 'Pedido creado exitosamente',
    error: false,
    fields: [],
  }
}

export const updateOrder = async (id: number, data: PedidoFormValues) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const order = await prisma.pedido.findUnique({
    where: {
      id,
    },
  })

  if (!order) {
    return {
      error: 'El pedido no existe',
      success: false,
    }
  }

  await prisma.pedido.update({
    where: {
      id,
    },
    data: {
      ...data,
      renglones: {
        deleteMany: {},
        create: data.renglones.map((renglon) => ({
          ...renglon,
        })),
      },
    },
  })

  await registerAuditAction(`Se actualizó el pedido con el id: ${id}`)
  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    success: 'Recepcion actualizada exitosamente',
    error: false,
  }
}

export const getOrderById = async (id: number): Promise<PedidoFormValues> => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const order = await prisma.pedido.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          renglon: true,
        },
      },
      abastecedor: true,
      autorizador: true,
      supervisor: true,
      destinatario: true,
      proveedor: true,
      unidad: true,
    },
  })

  if (!order) {
    throw new Error('Recepcion no existe')
  }

  return {
    id_destinatario: order.destinatario?.id,
    id_proveedor: order.proveedor?.id,
    id_unidad: order.unidad?.id,
    id_abastecedor: order.abastecedor?.id,
    id_autorizador: order.autorizador?.id,
    id_supervisor: order.supervisor?.id,
    motivo: order.motivo,
    fecha_solicitud: order.fecha_solicitud,
    estado: order.estado,
    tipo_proveedor: order.tipo_proveedor,
    renglones: order.renglones.map((renglon) => ({
      id_renglon: renglon.renglon.id,
      observacion: renglon.observacion,
      cantidad: renglon.cantidad,
    })),
  }
}

export const deleteOrder = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.pedido.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El pedido no existe',
      success: null,
    }
  }

  await prisma.pedido.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    `Se eliminó un pedido que tenía el motivo: ${exist?.motivo}`
  )
  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    error: null,
    success: 'Recepción eliminada exitosamente',
  }
}
// export const deleteMultipleReceptions = async (ids: number[]) => {
//   const sessionResponse = await validateUserSession()

//   if (sessionResponse.error || !sessionResponse.session) {
//     return sessionResponse
//   }

//   const permissionsResponse = validateUserPermissions({
//     sectionName: SECTION_NAMES.RECEPCION,
//     actionName: 'ELIMINAR',
//     userPermissions: sessionResponse.session?.user.rol.permisos,
//   })

//   if (!permissionsResponse.success) {
//     return permissionsResponse
//   }

//   await prisma.recepcion.deleteMany({
//     where: {
//       id: {
//         in: ids,
//       },
//     },
//   })

//   await registerAuditAction(
//     `Se han eliminado las siguientes recepciones ${ids}`
//   )
//   revalidatePath('/dashboard/abastecimiento/recepciones')

//   return {
//     success: 'Se ha eliminado la recepción correctamente',
//     error: false,
//   }
// }
