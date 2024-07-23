'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

import { CreateRolesWithPermissions } from '@/types/types'

import { registerAuditAction } from '@/lib/actions/audit'
import { Niveles_Usuarios } from '@prisma/client'

export const createRol = async (data: CreateRolesWithPermissions) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { rol, descripcion, permisos, nivel } = data
  const exist = await prisma.rol.findUnique({
    where: {
      rol,
    },
  })
  if (exist) {
    return {
      field: 'rol',
      error: 'Este rol ya existe',
    }
  }

  await prisma.rol.create({
    data: {
      rol,
      descripcion,
      nivel,
      permisos: {
        create: permisos.map((permiso) => ({
          permiso: {
            connectOrCreate: {
              where: {
                key: permiso,
              },
              create: {
                permiso: permiso,
                descripcion: 'Permiso creado por: ' + session.user.name,
                key: permiso,
              },
            },
          },
        })),
      },
    },
  })
  revalidatePath('/dashboard/abastecimiento/usuarios')
  await registerAuditAction(
    'CREAR',
    `Se creó un nuevo rol con el siguiente nombre: ${rol}`
  )
  return {
    success: 'Rol creado exitosamente',
  }
}

export const updateRol = async (
  id: number,
  data: CreateRolesWithPermissions
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const rol = await prisma.rol.update({
    where: {
      id,
    },
    data: {
      ...data,
      permisos: {
        deleteMany: {},
        create: data.permisos.map((permiso) => {
          return {
            permiso_key: permiso,
          }
        }),
      },
    },
  })

  // if user has the same rol update the session

  // if (session?.user.rol.rol === data.rol) {
  //   update({ user: { ...session.user, rol: data } }).catch(console.error)
  //   console.log('updated session', data.permisos)
  // }

  revalidatePath('/dashboard/abastecimiento/usuarios')
  await registerAuditAction(
    'ACTUALIZAR',
    `Se editó el rol con el siguiente nombre: ${rol.rol}`
  )
  return {
    success: 'Rol actualizado exitosamente',
  }
}

export const deleteRol = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const rol = await prisma.rol.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/usuarios')
  await registerAuditAction(
    'ELIMINAR',
    `Se eliminó el rol con el siguiente nombre: ${rol.rol}`
  )
  return {
    success: 'Rol eliminado exitosamente',
    error: false,
  }
}
export const recoverRol = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const rol = await prisma.rol.update({
    where: {
      id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  revalidatePath('/dashboard/abastecimiento/usuarios')
  await registerAuditAction(
    'RECUPERAR',
    `Se recuperó el rol con el siguiente nombre: ${rol.rol}`
  )
  return {
    success: 'Rol recuperado exitosamente',
    error: false,
  }
}
export const getAllRoles = async (isOnlyActive?: boolean) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const roles = await prisma.rol.findMany({
    orderBy: {
      ultima_actualizacion: 'desc',
    },
    where: {
      fecha_eliminacion: isOnlyActive ? null : undefined,
    },
    include: {
      permisos: true,
    },
  })
  return roles
}
export const getRolesByLevel = async (nivel: Niveles_Usuarios) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const roles = await prisma.rol.findMany({
    where: {
      nivel,
      fecha_eliminacion: null,
    },
    include: {
      permisos: true,
    },
  })
  return roles
}
export const getRolById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const rol = await prisma.rol.findUnique({
    where: {
      id,
    },
    include: {
      permisos: {
        include: {
          permiso: true,
        },
      },
    },
  })

  if (!rol) {
    throw new Error('Rol not found')
  }
  return {
    ...rol,
    permisos: rol.permisos.map((permiso) => permiso.permiso_key),
  }
}
