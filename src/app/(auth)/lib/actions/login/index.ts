'use server'
import * as z from 'zod'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { LoginByFaceIDSchema, LoginSchema } from '@/utils/schemas'
import { getUserByEmail, getUserByFacialID } from '@/lib/data/get-user-byEmail'
import bcrypt from 'bcryptjs'
import { registerAuditActionWithoutSession } from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'

type Credentials = {
  email: string
  password: string
}

export async function login(
  values: z.infer<typeof LoginSchema>,

  callbackUrl?: string | null
) {
  const validatedFields = LoginSchema.safeParse(values)

  const registeredUsers = await prisma.usuario.count()

  if (registeredUsers === 0) {
    await prisma.$transaction(async (prisma) => {
      const rolData = {
        rol: 'Administrador',
        descripcion: 'Permitir acceso a todas las funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso = await prisma.permiso.upsert({
        where: { key: 'TODAS:FULL' },
        update: {},
        create: {
          permiso: 'Acceso de superusuario',
          key: 'TODAS:FULL',
          descripcion:
            'Este permiso otorga acceso total del sistema al rol que lo posee',
        },
      })
      const password = await bcrypt.hash(
        `${process.env.SUPERUSER_PASSWORD}`,
        10
      )
      await prisma.roles_Permisos.create({
        data: {
          rol_nombre: rol.rol,
          permiso_key: permiso.key,
          active: true,
        },
      })

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          cedula: '0000000000',
          tipo_cedula: 'V',
          nombre: 'Superusuario',
          email: `${process.env.SUPERUSER_EMAIL}`,
          contrasena: password,
          estado: 'Activo',
          rol: {
            connect: {
              id: rol.id,
            },
          },
        },
      })
    })

    return { error: 'Se acaba de crear el primer usuario vuelva a intentarlo' }
  }

  if (!validatedFields.success) {
    return { error: 'The email or password is invalid' }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email) {
    return { error: 'No hay un usuario con este correo', field: 'email' }
  }

  if (!existingUser.contrasena) {
    return {
      error:
        'El usuario no tiene una contraseña registrada, pruebe con otro metodo de inicio de sesión',
      field: 'password',
    }
  }

  if (existingUser.estado === 'Bloqueado') {
    return {
      error:
        'Este usuario está bloqueado, por favor contacte al administrador o algún superior',
      field: null,
    }
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.contrasena)
  if (!passwordMatch) {
    return await checkFailedAttempts(
      existingUser.intentos_fallidos,
      'Contraseña',
      email
    )
  }

  try {
    const user = await getUserByEmail(email)

    await registerAuditActionWithoutSession(
      'INICIAR_SESION',
      `Inició sesión con email y contraseña`,
      user?.id || ''
    )
    await prisma.usuario.update({
      where: {
        email,
      },
      data: {
        intentos_fallidos: 0,
      },
    })
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || '/dashboard',
    })
    return { success: 'Inicio de sesión exitoso' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error
  }
}
export async function loginByFacialID(
  values: z.infer<typeof LoginByFaceIDSchema>
) {
  const validatedFields = LoginByFaceIDSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'No hay un facial id valido', field: 'facialID' }
  }

  const { facialID } = validatedFields.data

  const existingUser = await getUserByFacialID(facialID)

  if (!existingUser) {
    return { error: 'No hay un usuario con este facial id', field: 'facialID' }
  }

  try {
    await registerAuditActionWithoutSession(
      'INICIAR_SESION',
      `Inició sesión mediante facial ID: ${facialID}`,
      existingUser?.id || ''
    )

    return { success: 'Inicio de sesión exitoso' }
  } catch (error) {
    console.log(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }
    throw error
  }
}
export async function validateUser(credentials: Credentials) {
  if (!credentials.email || !credentials.password) {
    return {
      error: 'El email y la contraseña son requeridos',
      success: false,
    }
  }

  const { email, password } = credentials

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email) {
    return {
      error: 'No hay un usuario con este correo',
      field: 'email',
      success: false,
    }
  }

  if (!existingUser.contrasena) {
    return {
      error:
        'El usuario no tiene una contraseña registrada, pruebe con otro metodo de inicio de sesión',
      field: 'password',
      success: false,
    }
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.contrasena)
  if (!passwordMatch) {
    return { error: 'Contraseña incorrecta', field: 'password', success: false }
  }

  return { success: 'Verificación exitosa', error: false, user: existingUser }
}

export async function validateFacialId(facialID: string) {
  if (!facialID) {
    return {
      error: 'No hay un facial id valido',
      field: 'facialID',
      success: false,
    }
  }

  const existingUser = await getUserByFacialID(facialID)

  if (!existingUser) {
    return { error: 'No hay un usuario con este facial id', field: 'facialID' }
  }

  return { success: 'Verificación exitosa', error: false, user: existingUser }
}

export async function validatePin(pin: string, facialID: string) {
  if (!facialID) {
    return {
      error: 'No hay un facial id valido',
      field: 'pin',
      success: false,
    }
  }

  if (!pin) {
    return {
      error: 'No hay un pin valido',
      field: 'pin',
      success: false,
    }
  }

  const existingUser = await getUserByFacialID(facialID)

  if (!existingUser) {
    return {
      error: 'No hay un usuario con este facial id',
      field: 'pin',
      success: false,
    }
  }

  if (pin !== existingUser.facial_pin) {
    return await checkFailedAttempts(
      existingUser.intentos_fallidos,
      'Pin',
      existingUser.email
    )
  }

  try {
    await registerAuditActionWithoutSession(
      'INICIAR_SESION',
      `Inició sesión mediante facial ID: ${facialID}`,
      existingUser?.id
    )
    await signIn('credentials', {
      facialID,
      redirectTo: '/dashboard',
    })

    return { success: 'Inicio de sesión exitoso', error: false, field: null }
  } catch (error) {
    console.log(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!', field: 'pin', success: false }
        default:
          return {
            error: 'Something went wrong!',
            field: 'pin',
            success: false,
          }
      }
    }
    throw error
  }
}

async function checkFailedAttempts(
  attempts: number | null | undefined,
  type: 'Pin' | 'Contraseña',
  userEmail?: string | null
) {
  const errorMessage =
    type === 'Pin' ? 'Pin incorrecto' : 'Contraseña incorrecta'

  if (!userEmail) {
    return {
      error: `${errorMessage}, intenta de nuevo por favor`,
      success: false,

      field: 'password',
    }
  }

  if (!attempts) {
    await prisma.usuario.update({
      where: {
        email: userEmail,
      },
      data: {
        intentos_fallidos: 1,
      },
    })
    return {
      error: `${errorMessage}, intenta de nuevo por favor, quedan 2 intentos`,
      success: false,

      field: 'password',
    }
  }

  if (attempts < 2) {
    await prisma.usuario.update({
      where: {
        email: userEmail,
      },
      data: {
        intentos_fallidos: attempts + 1,
      },
    })

    return {
      error: `${errorMessage}, intenta de nuevo, quedan ${
        2 - attempts
      } intentos`,
      success: false,

      field: 'password',
    }
  }
  if (attempts >= 2) {
    await prisma.usuario.update({
      where: {
        email: userEmail,
      },
      data: {
        estado: 'Bloqueado',
        intentos_fallidos: attempts + 1,
      },
    })
    return {
      error:
        'Este usuario está bloqueado, por favor contacte al administrador o algún superior.',
      success: false,
      field: null,
    }
  }

  return { error: errorMessage, success: false, field: 'password' }
}
