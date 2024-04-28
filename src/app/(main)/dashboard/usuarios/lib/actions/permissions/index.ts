'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Permiso, Prisma } from '@prisma/client'
import { registerAuditAction } from '@/lib/actions/audit'
export const createPermission = async (data: Prisma.PermisoCreateInput) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { key } = data
  const exist = await prisma.permiso.findUnique({
    where: {
      key,
    },
  })
  if (exist) {
    return {
      field: 'permiso',
      error: 'Este permiso ya existe',
    }
  }

  await prisma.permiso.create({
    data,
  })
  revalidatePath('/dashboard/usuarios')
  return {
    success: 'Permiso creado exitosamente',
  }
}

export const createManyPermissions = async (
  data: Prisma.PermisoCreateManyInput
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  await prisma.permiso.createMany({
    data,
  })
  revalidatePath('/dashboard/usuarios')
  return {
    success: 'Permisos creados exitosamente',
  }
}

export const updatePermiso = async (
  id: number,
  data: Prisma.PermisoUpdateInput
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.permiso.update({
    where: {
      id,
    },
    data,
  })
  revalidatePath('/dashboard/usuarios')
  return {
    success: 'Permiso actualizado exitosamente',
  }
}

export const deletePermiso = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const permiso = await prisma.permiso.findUnique({
    where: {
      id,
    },
  })

  if (!permiso) {
    return {
      error: 'Permiso no encontrado',
      success: false,
    }
  }

  await prisma.permiso.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(`Se eliminó el permiso ${permiso.key}`)
  revalidatePath('/dashboard/usuarios')

  return {
    success: 'Permiso eliminado exitosamente',
    error: false,
  }
}

export const getAllPermissions = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const permisos = await prisma.permiso.findMany()
  return permisos
}

export const getPermissionById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const permiso = await prisma.permiso.findUnique({
    where: {
      id,
    },
  })

  if (!permiso) {
    throw new Error('Permiso no encontrado')
  }
  return permiso
}
