'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const createPersonnel = async (
  data: Prisma.PersonalUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PERSONAL,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.personal.findUnique({
    where: {
      cedula: data.cedula,
    },
  })

  if (exists) {
    return {
      error: 'El personal ya existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.personal.create({
    data,
  })

  await registerAuditAction(
    'Se creó un nuevo personal con la cédula ' + data.cedula
  )
  revalidatePath('/dashboard/recursos-humanos/personal')

  return {
    success: 'El personal ha sido creado con exito',
    error: false,
  }
}

export const checkIfPersonnelExists = async (cedula: string) => {
  const exists = await prisma.personal.findUnique({
    where: {
      cedula,
    },
  })

  return exists
}
export const getAllPersonnel = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const personnel = await prisma.personal.findMany({
    include: {
      usuario: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
      guardias: true,
    },
  })
  return personnel
}

export const deletePersonnel = async (cedula: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PERSONAL,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.personal.findUnique({
    where: {
      cedula,
    },
  })

  if (!exists) {
    return {
      error: 'El personal no existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.destinatario.delete({
    where: {
      cedula,
    },
  })

  await registerAuditAction('Se elimino el personal con la cedula ' + cedula)
  revalidatePath('/dashboard/recursos-humanos/personal')

  return {
    success: 'El personal ha sido eliminado con exito',
    error: false,
  }
}

export const updatePersonnel = async (
  data: Prisma.PersonalUpdateInput,
  id: number
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const exists = await prisma.personal.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'el personal no existe',
      success: false,
    }
  }

  await prisma.personal.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'Se actualizó el personal con la cedula ' + exists.cedula
  )

  revalidatePath('/dashboard/recursos-humanos/personal')

  return {
    success: 'El personal ha sido actualizado con exito',
    error: false,
  }
}

export const getPersonnelById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const personnel = await prisma.personal.findUnique({
    where: {
      id,
    },
    include: {
      usuario: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
    },
  })

  if (!personnel) {
    throw new Error('Receiver not found')
  }
  return personnel
}
