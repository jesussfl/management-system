'use server'
import * as z from 'zod'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { LoginByFaceIDSchema, LoginSchema } from '@/utils/schemas'
import { getUserByEmail, getUserByFacialID } from '@/lib/data/get-user-byEmail'
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'
import {
  registerAuditAction,
  registerAuditActionWithoutSession,
} from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'

type Credentials = {
  email: string
  password: string
}

type facialIdCredentials = {
  facialID: string
}
export async function checkFailedTries(email: string) {
  if (!email) {
    return null
  }
  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
    select: {
      intentos_fallidos: true,
    },
  })
  return user?.intentos_fallidos || 6
}
export async function login(
  values: z.infer<typeof LoginSchema>,
  // tries: number,
  callbackUrl?: string | null
) {
  const validatedFields = LoginSchema.safeParse(values)

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
    return { error: 'Este usuario está bloqueado', field: null }
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.contrasena)
  if (!passwordMatch) {
    const failedTries = await prisma.usuario.findUnique({
      where: {
        email,
      },
      select: {
        intentos_fallidos: true,
      },
    })

    if (!failedTries?.intentos_fallidos) {
      await prisma.usuario.update({
        where: {
          email,
        },
        data: {
          intentos_fallidos: 1,
        },
      })
      return {
        error: 'Contraseña incorrecta, intenta de nuevo',
        field: 'password',
      }
    }

    if (failedTries.intentos_fallidos < 5) {
      await prisma.usuario.update({
        where: {
          email,
        },
        data: {
          intentos_fallidos: failedTries?.intentos_fallidos + 1,
        },
      })

      return {
        error:
          'Contraseña incorrecta, intenta de nuevo, quedan ' +
          (5 - failedTries.intentos_fallidos) +
          ' intentos',
        field: 'password',
      }
    }
    if (failedTries.intentos_fallidos >= 5) {
      await prisma.usuario.update({
        where: {
          email,
        },
        data: {
          estado: 'Bloqueado',
          intentos_fallidos: failedTries?.intentos_fallidos + 1,
        },
      })
      return {
        error: 'Este usuario está bloqueado',
        field: null,
      }
    }
    return { error: 'Contraseña incorrecta', field: 'password' }
  }

  try {
    const user = await getUserByEmail(email)

    await registerAuditActionWithoutSession(
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
      field: 'facialID',
      success: false,
    }
  }

  const existingUser = await getUserByFacialID(facialID)

  if (!existingUser) {
    return { error: 'No hay un usuario con este facial id', field: 'facialID' }
  }

  if (pin !== existingUser.facial_pin) {
    const failedTries = await prisma.usuario.findUnique({
      where: {
        facialID,
      },
      select: {
        intentos_fallidos: true,
      },
    })

    if (!failedTries?.intentos_fallidos) {
      await prisma.usuario.update({
        where: {
          facialID,
        },
        data: {
          intentos_fallidos: 1,
        },
      })
      return {
        error: 'Pin incorrecto, intenta de nuevo por favor',
        field: 'password',
      }
    }

    if (failedTries.intentos_fallidos < 5) {
      await prisma.usuario.update({
        where: {
          facialID,
        },
        data: {
          intentos_fallidos: failedTries?.intentos_fallidos + 1,
        },
      })

      return {
        error:
          'Pin incorrecto, intenta de nuevo, quedan ' +
          (5 - failedTries.intentos_fallidos) +
          ' intentos',
        field: 'password',
      }
    }
    if (failedTries.intentos_fallidos >= 5) {
      await prisma.usuario.update({
        where: {
          facialID,
        },
        data: {
          estado: 'Bloqueado',
          intentos_fallidos: failedTries?.intentos_fallidos + 1,
        },
      })
      return {
        error: 'Este usuario está bloqueado',
        field: null,
      }
    }
    // return { error: 'Pin incorrecto ', field: 'password' }
  }

  try {
    const user = await getUserByFacialID(facialID)
    await registerAuditActionWithoutSession(
      `Inició sesión mediante facial ID: ${facialID}`,
      user?.id || ''
    )
    await signIn('credentials', {
      facialID: facialID,
      redirectTo: '/dashboard',
    })

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
    const user = await getUserByFacialID(facialID)
    await registerAuditActionWithoutSession(
      `Inició sesión mediante facial ID: ${facialID}`,
      user?.id || ''
    )
    // await signIn('credentials', {
    //   facialID: facialID,
    //   redirectTo: callbackUrl || '/dashboard',
    // })

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

export async function getIp() {
  const response = await fetch('https://api.ipify.org?format=json')
  console.log('response', response)
  const data = await response.json()
  return data
}
