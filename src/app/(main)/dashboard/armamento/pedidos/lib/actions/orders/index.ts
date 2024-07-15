'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'

import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { PedidoFormValues } from '../../../components/forms/orders-form'
import { Estados_Pedidos } from '@prisma/client'

export const getAllOrders = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const pedidos = await prisma.pedido.findMany({
    where: {
      servicio: 'Armamento',
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
    sectionName: SECTION_NAMES.PEDIDOS_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const order = await prisma.pedido.create({
    data: {
      ...data,
      servicio: 'Armamento',
      estado: data.estado || 'Pendiente',
      renglones: {
        create: data.renglones.map((renglon) => ({
          ...renglon,
        })),
      },
    },
  })

  await registerAuditAction(
    'CREAR',
    `Se creó un nuevo pedido de armamento con el siguient motivo: ${data.motivo} y para la fecha: ${data.fecha_solicitud} con el id ${order.id}`
  )
  revalidatePath('/dashboard/armamento/pedidos')

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
    sectionName: SECTION_NAMES.PEDIDOS_ARMAMENTO,
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

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó el pedido de armamento con el id: ${id}`
  )
  revalidatePath('/dashboard/armamento/pedidos')

  return {
    success: 'Recepcion actualizada exitosamente',
    error: false,
  }
}

export const updateOrderStatus = async (
  id: number,
  data: {
    estado: Estados_Pedidos | null | undefined
  }
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS_ARMAMENTO,
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
      estado: data.estado,
    },
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó el estado del pedido de armamento con el id: ${id} a: ${data.estado}`
  )

  revalidatePath('/dashboard/armamento/pedidos')

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
    sectionName: SECTION_NAMES.PEDIDOS_ARMAMENTO,
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
    'ELIMINAR',
    `Se eliminó un pedido de armamento que tenía el motivo: ${exist?.motivo}`
  )
  revalidatePath('/dashboard/armamento/pedidos')

  return {
    error: null,
    success: 'Pedido eliminado exitosamente',
  }
}
