'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { RegisterSchema } from '@/utils/schemas'
import { getUserByEmail } from '@/lib/data/get-user-byEmail'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Tipos_Cedulas } from '@prisma/client'
import { registerAuditActionWithoutSession } from '@/lib/actions/audit'

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, name } = validatedFields.data
  const adminPasswordDb = await prisma.admin.findFirst({
    where: {
      state: 'Activa',
    },
  })
  // if (adminPassword !== adminPasswordDb?.password) {
  //   return {
  //     error: 'Contraseña de administrador incorrecta',
  //     field: 'adminPassword',
  //   }
  // }

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Este correo ya está registrado', field: 'email' }
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Parte 1: Contar Usuarios
      const users_count = await prisma.usuario.count()

      // Determinar el rol y su descripción basados en el conteo de usuarios
      const rolData = {
        rol: users_count === 0 ? 'Administrador' : 'Básico',
        descripcion:
          users_count === 0
            ? 'Permitir acceso a todas las funcionalidades'
            : 'Acceso limitado a algunas funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso
      if (users_count === 0) {
        permiso = await prisma.permiso.upsert({
          where: { key: 'TODAS:FULL' },
          update: {},
          create: {
            permiso: 'Acceso de superusuario',
            key: 'TODAS:FULL',
            descripcion:
              'Este permiso otorga acceso total del sistema al rol que lo posee',
          },
        })

        await prisma.roles_Permisos.create({
          data: {
            rol_nombre: rol.rol,
            permiso_key: permiso.key,
            active: true,
          },
        })
      }

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          cedula: validatedFields.data.cedula,
          tipo_cedula: validatedFields.data.tipo_cedula,
          nombre: name,
          email,
          contrasena: hashedPassword,
          estado: 'Activo',
          rol: {
            connect: {
              id: rol.id,
            },
          },
        },
      })
    })

    const user = await getUserByEmail(email)
    await registerAuditActionWithoutSession(
      `Se ha registrado un nuevo usuario con correo y contraseña. El correo es: ${email}`,
      user?.id || ''
    )
    console.log('Usuario creado exitosamente')
    return { success: 'Registrado correctamente' }
  } catch (error) {
    console.error('Error al crear el usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export const signupByAdmin = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, name, rol: _rol } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Este correo ya está registrado', field: 'email' }
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Parte 1: Contar Usuarios
      const users_count = await prisma.usuario.count()

      // Determinar el rol y su descripción basados en el conteo de usuarios
      const rolData = {
        rol: users_count === 0 ? 'Administrador' : 'Básico',
        descripcion:
          users_count === 0
            ? 'Permitir acceso a todas las funcionalidades'
            : 'Acceso limitado a algunas funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso
      if (users_count === 0) {
        permiso = await prisma.permiso.upsert({
          where: { key: 'TODAS:FULL' },
          update: {},
          create: {
            permiso: 'Acceso de superusuario',
            key: 'TODAS:FULL',
            descripcion:
              'Este permiso otorga acceso total del sistema al rol que lo posee',
          },
        })

        await prisma.roles_Permisos.create({
          data: {
            rol_nombre: rol.rol,
            permiso_key: permiso.key,
            active: true,
          },
        })
      }

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          cedula: validatedFields.data.cedula,
          tipo_cedula: validatedFields.data.tipo_cedula,
          nombre: name,
          email,
          contrasena: hashedPassword,
          estado: 'Activo',
          rol: {
            connect: {
              id: _rol,
            },
          },
        },
      })
    })

    const user = await getUserByEmail(email)
    await registerAuditActionWithoutSession(
      `Se ha registrado un nuevo usuario con correo y contraseña. El correo es: ${email}`,
      user?.id || ''
    )
    console.log('Usuario creado exitosamente')
    return { success: 'Registrado correctamente' }
  } catch (error) {
    console.error('Error al crear el usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

type SignupByFacialID = {
  email: string
  facialID: string
  rol: number
  name: string
  cedula: string
  tipo_cedula: Tipos_Cedulas
}
export const signupByFacialID = async ({
  email,
  facialID,
  name,
  cedula,
  tipo_cedula,
}: SignupByFacialID) => {
  const existingUser = await getUserByEmail(email)
  const eixstingUserByFacialID = await prisma.usuario.findUnique({
    where: {
      facialID,
    },
  })

  if (existingUser || eixstingUserByFacialID) {
    return {
      error: 'Esta persona ya está registrada',
      field: 'email',
    }
  }
  console.log({ email, facialID, name })

  try {
    await prisma.$transaction(async (prisma) => {
      // Parte 1: Contar Usuarios
      const users_count = await prisma.usuario.count()

      // Determinar el rol y su descripción basados en el conteo de usuarios
      const rolData = {
        rol: users_count === 0 ? 'Administrador' : 'Básico',
        descripcion:
          users_count === 0
            ? 'Permitir acceso a todas las funcionalidades'
            : 'Acceso limitado a algunas funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso
      if (users_count === 0) {
        permiso = await prisma.permiso.upsert({
          where: { key: 'TODAS:FULL' },
          update: {},
          create: {
            permiso: 'Acceso de superusuario',
            key: 'TODAS:FULL',
            descripcion:
              'Este permiso otorga acceso total del sistema al rol que lo posee',
          },
        })

        await prisma.roles_Permisos.create({
          data: {
            rol_nombre: rol.rol,
            permiso_key: permiso.key,
            active: true,
          },
        })
      }

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          cedula,
          tipo_cedula,
          nombre: name,
          email,
          facialID,
          estado: 'Activo',
          rol: {
            connect: {
              id: rol.id,
            },
          },
        },
      })
    })
    const user = await getUserByEmail(email)
    await registerAuditActionWithoutSession(
      `Se ha registrado un nuevo usuario con facialID. El correo es: ${email}`,
      user?.id || ''
    )
    console.log('Usuario creado exitosamente')
    return { success: 'Registrado correctamente' }
  } catch (error) {
    console.error('Error al crear el usuario:', error)
    return { error: 'Error al registrar la persona', field: 'facialID' }
  } finally {
    await prisma.$disconnect()
  }
}
export const signupByFacialIDByAdmin = async ({
  email,
  facialID,
  rol: _rol,
  name,
  cedula,
  tipo_cedula,
}: SignupByFacialID) => {
  const existingUser = await getUserByEmail(email)
  const eixstingUserByFacialID = await prisma.usuario.findUnique({
    where: {
      facialID,
    },
  })

  if (existingUser || eixstingUserByFacialID) {
    return {
      error: 'Esta persona ya está registrada',
      field: 'email',
    }
  }
  console.log({ email, facialID, name })

  try {
    await prisma.$transaction(async (prisma) => {
      // Parte 1: Contar Usuarios
      const users_count = await prisma.usuario.count()

      // Determinar el rol y su descripción basados en el conteo de usuarios
      const rolData = {
        rol: users_count === 0 ? 'Administrador' : 'Básico',
        descripcion:
          users_count === 0
            ? 'Permitir acceso a todas las funcionalidades'
            : 'Acceso limitado a algunas funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso
      if (users_count === 0) {
        permiso = await prisma.permiso.upsert({
          where: { key: 'TODAS:FULL' },
          update: {},
          create: {
            permiso: 'Acceso de superusuario',
            key: 'TODAS:FULL',
            descripcion:
              'Este permiso otorga acceso total del sistema al rol que lo posee',
          },
        })

        await prisma.roles_Permisos.create({
          data: {
            rol_nombre: rol.rol,
            permiso_key: permiso.key,
            active: true,
          },
        })
      }

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          cedula,
          tipo_cedula,
          nombre: name,
          email,
          facialID,
          estado: 'Activo',
          rol: {
            connect: {
              id: _rol,
            },
          },
        },
      })
    })
    const user = await getUserByEmail(email)
    await registerAuditActionWithoutSession(
      `Se ha registrado un nuevo usuario con facialID. El correo es: ${email}`,
      user?.id || ''
    )
    console.log('Usuario creado exitosamente')
    return { success: 'Registrado correctamente' }
  } catch (error) {
    console.error('Error al crear el usuario:', error)
    return { error: 'Error al registrar la persona', field: 'facialID' }
  } finally {
    await prisma.$disconnect()
  }
}
export const getAllUsers = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const users = await prisma.usuario.findMany()
  return users
}

export const checkIfUserExists = async (cedula: string) => {
  if (!cedula) {
    return null
  }

  const user = await prisma.usuario.findUnique({
    where: {
      cedula,
    },
  })
  return user
}
