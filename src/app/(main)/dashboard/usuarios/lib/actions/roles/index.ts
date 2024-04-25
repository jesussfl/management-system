'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { CreateRolesWithPermissions } from '@/types/types'

type Rol = Prisma.RolGetPayload<{ include: { permisos: true } }>

export const createRol = async (data: CreateRolesWithPermissions) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const { rol, descripcion, permisos } = data
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
      permisos: {
        create: permisos.map((permiso) => ({
          permiso: {
            connect: {
              key: permiso.permiso_key,
            },
          },
        })),
      },
    },
  })
  revalidatePath('/dashboard/abastecimiento/usuarios')
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

  console.log(data, 'dataaa')
  await prisma.rol.update({
    where: {
      id,
    },
    data: {
      ...data,
      permisos: {
        deleteMany: {},
        create: data.permisos.map((permiso) => {
          return {
            permiso_key: permiso.permiso_key,
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
  return {
    success: 'Rol actualizado exitosamente',
  }
}

export const deleteRol = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.rol.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/usuarios')
}

export const getAllRoles = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const roles = await prisma.rol.findMany({
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
    permisos: rol.permisos.map((permiso) => ({
      value: permiso.permiso.key,
      label: permiso.permiso.permiso,
    })),
  }
}
