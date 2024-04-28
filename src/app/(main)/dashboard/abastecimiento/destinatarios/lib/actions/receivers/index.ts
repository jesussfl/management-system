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
    sectionName: SECTION_NAMES.INVENTARIO,
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

  await prisma.destinatario.create({
    data,
  })

  await registerAuditAction(
    `Se creó un nuevo destinatario con la cédula: ${data.cedula}`
  )
  revalidatePath('/dashboard/abastecimiento/destinatarios')

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

export const deleteReceiver = async (cedula: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.destinatario.findUnique({
    where: {
      cedula,
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
      cedula,
    },
  })

  await registerAuditAction(
    `Se eliminó el destinatario con la cedula: ${cedula}`
  )
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Receiver deleted successfully',
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
    sectionName: SECTION_NAMES.INVENTARIO,
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

  await prisma.destinatario.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    `Se actualizo el destinatario con la cedula: ${data.cedula}`
  )

  revalidatePath('/dashboard/abastecimiento/destinatarios')

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
