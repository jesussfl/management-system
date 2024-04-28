'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const createItem = async (data: Prisma.RenglonUncheckedCreateInput) => {
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
  const { nombre } = data
  const exist = await prisma.renglon.findUnique({
    where: {
      nombre,
    },
  })
  if (exist) {
    return {
      field: 'nombre',
      success: false,
      error: 'El nombre de este renglón ya existe',
    }
  }
  await prisma.renglon.create({
    data,
  })

  await registerAuditAction(`Se ha creado el renglon ${nombre}`)
  revalidatePath('/dashboard/abastecimiento/renglones')

  return {
    success: 'Se ha creado el renglón correctamente',
    error: false,
  }
}

export const updateItem = async (
  id: number,
  data: Prisma.RenglonUpdateInput
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

  const exist = await prisma.renglon.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El renglón no existe',
      success: null,
    }
  }

  await prisma.renglon.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(`Se ha actualizado el renglón ${exist?.nombre}`)
  revalidatePath('/dashboard/abastecimiento/inventario')
}

export const deleteItem = async (id: number) => {
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

  const exist = await prisma.renglon.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El renglón no existe',
      success: false,
    }
  }

  await prisma.renglon.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(`Se ha eliminado el renglon ${id}`)
  revalidatePath('/dashboard/abastecimiento/recepciones')

  return {
    success: 'Se ha eliminado el renglón correctamente',
    error: false,
  }
}
export const checkItemExistance = async (name: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  if (!name) {
    return false
  }

  const exists = await prisma.renglon.findUnique({
    where: {
      nombre: name,
    },
  })

  return !!exists
}

export const getAllItems = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const renglones = await prisma.renglon.findMany({
    include: {
      recepciones: {
        include: {
          seriales: {
            include: {
              renglon: true,
            },
          },
        },
      },
      despachos: {
        include: {
          seriales: {
            include: {
              renglon: true,
            },
          },
        },
      },
      devoluciones: {
        include: {
          seriales: {
            include: {
              renglon: true,
            },
          },
        },
      },
      clasificacion: true,
      unidad_empaque: true,
      categoria: true,
      subsistema: true,
    },
  })
  return renglones
}

export const getItemById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }
  const renglon = await prisma.renglon.findUnique({
    where: {
      id,
    },
    include: {
      clasificacion: true,
      categoria: true,
      unidad_empaque: true,
    },
  })

  if (!renglon) {
    throw new Error('El renglon no existe')
  }
  return renglon
}
