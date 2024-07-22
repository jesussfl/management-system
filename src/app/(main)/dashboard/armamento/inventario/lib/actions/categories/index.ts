'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { registerAuditAction } from '@/lib/actions/audit'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'

export const createCategory = async (
  data: Prisma.CategoriaUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data

  const exist = await prisma.categoria.findUnique({
    where: {
      nombre,
    },
  })

  if (exist) {
    return {
      error: 'El nombre de esta categoria ya existe',
      success: null,
    }
  }

  await prisma.categoria.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    `Se creó una nueva categoría llamada: ${nombre}`
  )

  revalidatePath('/dashboard/armamento/inventario')

  return {
    success: 'Categoria creada exitosamente',
    error: null,
  }
}

export const updateCategory = async (
  id: number,
  data: Prisma.CategoriaUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.categoria.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La categoria no existe',
      success: null,
    }
  }

  await prisma.categoria.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó la categoria: ${exist?.nombre}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: null,
    success: 'Categoria actualizada exitosamente',
  }
}

export const deleteCategory = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.categoria.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La categoria no existe',
      success: null,
    }
  }

  await prisma.categoria.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se eliminó la categoria: ${exist?.nombre}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: null,
    success: 'Categoria eliminada exitosamente',
  }
}
export const recoverCategory = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.categoria.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La categoria no existe',
      success: null,
    }
  }

  await prisma.categoria.update({
    where: {
      id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    `Se recuperó la categoria: ${exist?.nombre}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: null,
    success: 'Categoria recuperada exitosamente',
  }
}
export const deleteMultipleCategories = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.categoria.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado las categorias con los siguientes ids: ${ids}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    success: 'Se ha eliminado la categoría correctamente',
    error: false,
  }
}
export const getCategoryById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const category = await prisma.categoria.findUnique({
    where: {
      id,
    },
    include: {
      clasificacion: true,
    },
  })

  if (!category) {
    throw new Error('La categoria no existe')
  }

  return category
}
export const getAllCategories = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const categories = await prisma.categoria.findMany({
    include: {
      clasificacion: true,
    },
  })

  return categories
}

export const getCategoriesByClassificationId = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const categories = await prisma.categoria.findMany({
    where: {
      id_clasificacion: id,
      fecha_eliminacion: null,
    },
  })

  return categories
}
