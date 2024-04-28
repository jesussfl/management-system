'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  Destinatario,
  Prisma,
  Profesional_Abastecimiento,
} from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const createProfessional = async (
  data: Prisma.Profesional_AbastecimientoUncheckedCreateInput
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

  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      cedula: data.cedula,
    },
  })

  if (exists) {
    return {
      error: 'El profesional ya existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.profesional_Abastecimiento.create({
    data,
  })

  await registerAuditAction(
    'Se creó un nuevo profesional con la cédula ' + data.cedula
  )
  revalidatePath('/dashboard/abastecimiento/profesionales')

  return {
    success: 'Professional created successfully',
    error: false,
  }
}

export const getAllProfessionals = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const professionals = await prisma.profesional_Abastecimiento.findMany({
    include: {
      abastecedor: true,
      autorizador: true,
      supervisor: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })
  return professionals
}

export const deleteProfessional = async (cedula: string) => {
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

  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      cedula,
    },
  })

  if (!exists) {
    return {
      error: 'El profesional no existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.destinatario.delete({
    where: {
      cedula,
    },
  })

  await registerAuditAction('Se elimino el profesional con la cedula ' + cedula)
  revalidatePath('/dashboard/abastecimiento/profesionales')

  return {
    success: 'Professional deleted successfully',
    error: false,
  }
}

export const updateProfessional = async (
  data: Prisma.Profesional_AbastecimientoUpdateInput,
  id: number
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'professional not found',
    }
  }

  await prisma.profesional_Abastecimiento.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  })

  revalidatePath('/dashboard/abastecimiento/profesionales')

  return {
    success: 'Professional updated successfully',
  }
}

export const getProfessionalById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const professional = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      id,
    },
    include: {
      abastecedor: true,
      autorizador: true,
      supervisor: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })

  if (!professional) {
    throw new Error('Receiver not found')
  }
  return professional
}
