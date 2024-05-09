'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissionsArray } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Prisma, Usuario } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export const getAllUsers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const users = await prisma.usuario.findMany()
  return users
}

export const getUserById = async (id: string) => {
  // const session = await auth()
  // if (!session?.user) {
  //   throw new Error('You must be signed in to perform this action')
  // }
  const user = await prisma.usuario.findUnique({
    where: {
      id,
    },
    include: {
      personal: true,
      rol: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }
  return {
    ...user,
    rol: user.rol.id,
  }
}

export const updateUser = async (
  id: string,
  data: Omit<Usuario, 'id'> & { rol: number }
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      rol: {
        connect: {
          id: data.rol,
        },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  revalidatePath('/dashboard/usuarios')
  return {
    success: 'User updated successfully',
  }
}

export const updateUserPassword = async (
  id: string,
  data: {
    password: string
    confirmPassword: string
    adminPassword: string
  }
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissionsArray({
    sections: [SECTION_NAMES.USUARIOS, SECTION_NAMES.TODAS],
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const adminPasswordDb = await prisma.admin.findFirst({
    where: {
      state: 'Activa',
    },
  })
  if (data.adminPassword !== adminPasswordDb?.password) {
    return {
      error: 'Contraseña de administrador incorrecta',
      field: 'adminPassword',
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      contrasena: hashedPassword,
    },
  })

  if (!user) {
    return {
      success: false,
      error: 'Usuario no encontrado',
    }
  }

  revalidatePath('/dashboard/usuarios')

  return {
    success: 'User updated successfully',
    error: false,
  }
}
