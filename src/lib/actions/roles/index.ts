'use server'
import { prisma } from '@/lib/prisma'
import { auth, update } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

type Rol = Prisma.RolGetPayload<{ include: { permisos: true } }>

export const createRol = async (data: Rol) => {
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
        create: permisos,
      },
    },
  })
  revalidatePath('/dashboard/abastecimiento/usuarios')
  return {
    success: 'Rol creado exitosamente',
  }
}

export const updateRol = async (id: number, data: Rol) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  console.log('data', data.permisos)
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

  if (session?.user.rol.rol === data.rol) {
    update({ user: { ...session.user, rol: data } }).catch(console.error)
    console.log('updated session', data.permisos)
  }

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
