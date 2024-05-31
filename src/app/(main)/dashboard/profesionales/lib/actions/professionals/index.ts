'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissionsArray } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import getSectionInfo from '@/utils/helpers/get-path-info'

const requiredSections = getSectionInfo({
  sectionName: SECTION_NAMES.PROFESIONALES,
  property: 'requiredPermissions',
})

export const createProfessional = async (
  data: Prisma.Profesional_AbastecimientoUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissionsArray({
    sections: requiredSections,
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
  revalidatePath('/dashboard/profesionales')

  return {
    success: 'Professional created successfully',
    error: false,
  }
}
export const checkIfProfessionalExists = async (cedula: string) => {
  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      cedula,
    },
  })

  return exists
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
export const getAllProfessionalsToCombobox = async (): Promise<
  { value: string; label: string }[]
> => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const professionals = await prisma.profesional_Abastecimiento.findMany({
    include: {
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })
  return professionals.map((professional) => ({
    value: professional.cedula,
    label: `${professional.tipo_cedula}-${professional.cedula} ${professional.nombres}-${professional.apellidos}`,
  }))
}
export const deleteProfessional = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissionsArray({
    sections: requiredSections,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'El profesional no existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.profesional_Abastecimiento.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'Se elimino el profesional con la cedula ' + exists.cedula
  )
  revalidatePath('/dashboard/profesionales')

  return {
    success: 'Professional deleted successfully',
    error: false,
  }
}

export const updateProfessional = async (
  data: Prisma.Profesional_AbastecimientoUpdateInput,
  id: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissionsArray({
    sections: requiredSections,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const exists = await prisma.profesional_Abastecimiento.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'professional not found',
      success: false,
    }
  }

  await prisma.profesional_Abastecimiento.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'Se actualizó el profesional con la cedula ' + data.cedula
  )

  revalidatePath('/dashboard/profesionales')

  return {
    success: 'Professional updated successfully',
    error: false,
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
