'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissionsArray } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Prisma, Usuario, Usuarios_Estados } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllUsers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const users = await prisma.usuario.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  })
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
      personal: {
        include: {
          guardias: true,
        },
      },
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
  await registerAuditAction(
    `Se actualizó el usuario con cédula: ${user.cedula}`
  )
  return {
    success: 'Actualización exitosa',
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
      estado: 'Activo',
      intentos_fallidos: 0,
    },
  })

  if (!user) {
    return {
      success: false,
      error: 'Usuario no encontrado',
    }
  }

  revalidatePath('/dashboard/usuarios')
  await registerAuditAction(
    `Se actualizó la contraseña del usuario con cédula: ${user.cedula}`
  )
  return {
    success: 'Contraseña actualizada correctamente',
    error: false,
  }
}
export const assignFacialID = async (
  id: string,
  facialID: string,
  facial_pin: string
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

  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      facialID,
      facial_pin,
    },
  })

  if (!user) {
    return {
      success: false,
      error: 'Usuario no encontrado',
    }
  }

  revalidatePath('/dashboard/usuarios')
  await registerAuditAction(
    `Se añadió un identificador facial a el usuario con cédula: ${user.cedula}`
  )
  return {
    success: 'Usuario actualizado correctamente',
    error: false,
  }
}
export const deleteDbFacialID = async (id: string) => {
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

  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      facialID: null,
    },
  })

  if (!user) {
    return {
      success: false,
      error: 'Usuario no encontrado',
    }
  }

  revalidatePath('/dashboard/usuarios')
  await registerAuditAction(
    `Se eliminó el identificador facial de el usuario con cédula: ${user.cedula}`
  )
  return {
    success: 'Usuario actualizado correctamente',
    error: false,
  }
}
export const updateUserState = async (id: string, estado: Usuarios_Estados) => {
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

  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      estado,
    },
  })

  if (!user) {
    return {
      success: false,
      error: 'Usuario no encontrado',
    }
  }

  revalidatePath('/dashboard/usuarios')
  await registerAuditAction(
    `Se ha cambiado el estado de el usuario con cédula: ${user.cedula} a: ${estado}`
  )
  return {
    success: `El usuario se ha ${
      estado === 'Activo' ? 'desbloqueado' : 'bloqueado'
    } correctamente`,
    error: false,
  }
}
