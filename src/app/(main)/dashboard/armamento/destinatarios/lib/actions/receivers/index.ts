'use server'
import { auth } from '@/auth'
import { registerAuditAction } from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Destinatario, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createReceiver = async (
  data: Prisma.DestinatarioUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const exists = await prisma.destinatario.findUnique({
    where: {
      cedula: data.cedula,
    },
  })

  if (exists) {
    return {
      error: 'El destinatario ya existe',
      field: 'cedula',
      success: false,
    }
  }

  const receiver = await prisma.destinatario.create({
    data: {
      ...data,
      servicio: 'Armamento',
    },
  })

  await registerAuditAction(
    'CREAR',
    `Se creó un nuevo destinatario de armamento con la cédula: ${receiver.cedula} y nombre: ${receiver.nombres} ${receiver.apellidos}`
  )
  revalidatePath('/dashboard/armamento/destinatarios')

  return {
    success: 'El destinatario se ha creado correctamente',
    error: false,
  }
}

export const getAllReceivers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const receivers = await prisma.destinatario.findMany({
    where: {
      servicio: 'Armamento',
    },
    include: {
      despachos: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })
  return receivers
}
export const getAllReceiversToCombobox = async (
  servicio: 'Abastecimiento' | 'Armamento'
): Promise<{ value: string; label: string }[]> => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const receivers = await prisma.destinatario.findMany({
    where: {
      servicio,
    },
    include: {
      despachos: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })
  return receivers.map((receiver) => ({
    value: receiver.cedula,
    label: `${receiver.tipo_cedula}-${receiver.cedula} ${
      receiver.grado?.abreviatura || ''
    } ${receiver.nombres} ${receiver.apellidos}`,
  }))
}
export const checkIfReceiverExists = async (cedula: string) => {
  if (!cedula) {
    return
  }

  const exists = await prisma.destinatario.findUnique({
    where: {
      cedula,
    },
  })

  return exists
}
export const deleteReceiver = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.destinatario.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Receiver not found',
      success: false,
    }
  }

  await prisma.destinatario.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se eliminó el destinatario de armamento con documento de identidad: ${exists.cedula} y nombre: ${exists.nombres} ${exists.apellidos}`
  )
  revalidatePath('/dashboard/armamento/destinatarios')

  return {
    success: 'El destinatario se ha eliminado correctamente',
    error: false,
  }
}

export const deleteMultipleReceivers = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.destinatario.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado los siguientes destinatarios de armamento con los siguientes ids: ${ids}`
  )
  revalidatePath('/dashboard/armamento/destinatarios')

  return {
    success: 'Se han eliminado los destinatarios correctamente',
    error: false,
  }
}

export const updateReceiver = async (
  data: Prisma.DestinatarioUpdateInput,
  id: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const exists = await prisma.destinatario.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Receiver not found',
      success: false,
    }
  }

  const receiver = await prisma.destinatario.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó el destinatario con la cedula: ${receiver.cedula} y nombre: ${receiver.nombres} ${receiver.apellidos}`
  )

  revalidatePath('/dashboard/armamento/destinatarios')

  return {
    success: 'Receiver updated successfully',
    error: false,
  }
}

export const getReceiverById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const receiver = await prisma.destinatario.findUnique({
    where: {
      id,
    },
    include: {
      despachos: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })

  if (!receiver) {
    throw new Error('Receiver not found')
  }
  return receiver
}
