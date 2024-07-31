'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'

import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { PedidoFormValues } from '../../../app/(main)/dashboard/components/order-form/orders-form'
import { Estados_Pedidos } from '@prisma/client'
import { format } from 'date-fns'

export const getAllOrders = async (
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const pedidos = await prisma.pedido.findMany({
    where: {
      servicio,
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
export const createOrder = async (
  data: PedidoFormValues,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.PEDIDOS_ABASTECIMIENTO
        : SECTION_NAMES.PEDIDOS_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const order = await prisma.pedido.create({
    data: {
      ...data,
      servicio,
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
    `Se creó un nuevo pedido de abastecimiento con el siguiente motivo: ${
      data.motivo
    }, el Id es: ${order.id} ${
      data.motivo_fecha
        ? `, la fecha de creación fue: ${format(
            order.fecha_creacion,
            'dd-MM-yyyy HH:mm'
          )} y la fecha de solicitud: ${format(
            order.fecha_solicitud,
            'dd-MM-yyyy HH:mm'
          )}, motivo de la fecha: ${data.motivo_fecha}`
        : ''
    }`
  )
  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    success: 'Pedido creado exitosamente',
    error: false,
    fields: [],
  }
}

export const updateOrder = async (
  id: number,
  data: PedidoFormValues,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.PEDIDOS_ABASTECIMIENTO
        : SECTION_NAMES.PEDIDOS_ARMAMENTO,
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
    `Se actualizó el pedido de ${servicio.toLowerCase()} con el id: ${id}, ${
      data.motivo_fecha
        ? `, la fecha de creación fue: ${format(
            order.fecha_creacion,
            'dd-MM-yyyy HH:mm'
          )} y la fecha de solicitud: ${format(
            order.fecha_solicitud,
            'dd-MM-yyyy HH:mm'
          )}, motivo de la fecha: ${data.motivo_fecha}`
        : ''
    }`
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/pedidos`)

  return {
    success: 'Recepcion actualizada exitosamente',
    error: false,
  }
}

export const updateOrderStatus = async (
  id: number,
  data: {
    estado: Estados_Pedidos | null | undefined
  },
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      servicio === 'Abastecimiento'
        ? SECTION_NAMES.PEDIDOS_ABASTECIMIENTO
        : SECTION_NAMES.PEDIDOS_ARMAMENTO,
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
    `Se actualizó el estado del pedido de ${servicio.toLowerCase()} con el id: ${id} a: ${
      data.estado
    }`
  )

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/pedidos`)

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
    throw new Error('Solicitud no existe')
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

export const deleteOrder = async (
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
        ? SECTION_NAMES.PEDIDOS_ABASTECIMIENTO
        : SECTION_NAMES.PEDIDOS_ARMAMENTO,
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
    `Se eliminó un pedido de ${servicio.toLowerCase()} que tenía el motivo: ${exist?.motivo} con el id: ${id}`
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/pedidos`)

  return {
    error: null,
    success: 'Pedido eliminado exitosamente',
  }
}

export const recoverOrder = async (
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
        ? SECTION_NAMES.PEDIDOS_ABASTECIMIENTO
        : SECTION_NAMES.PEDIDOS_ARMAMENTO,
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

  await prisma.pedido.update({
    where: {
      id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    `Se recuperó el pedido de ${servicio.toLowerCase()} que tenía el motivo: ${exist?.motivo} con el id: ${id}`
  )
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/pedidos`)

  return {
    error: null,
    success: 'Pedido recuperado exitosamente',
  }
}
