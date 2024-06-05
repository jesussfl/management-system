'use server'
import * as z from 'zod'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { LoginByFaceIDSchema, LoginSchema } from '@/utils/schemas'
import { getUserByEmail, getUserByFacialID } from '@/lib/data/get-user-byEmail'

import bcrypt from 'bcryptjs'

type Credentials = {
  email: string
  password: string
}

type facialIdCredentials = {
  facialID: string
}
export async function login(
  values: z.infer<typeof LoginSchema>,
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
    return { error: 'Contraseña incorrecta', field: 'password' }
  }

  try {
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
export async function loginByFacialID(
  values: z.infer<typeof LoginByFaceIDSchema>,
  callbackUrl?: string | null
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
    await signIn('credentials', {
      facialID: facialID,
      redirectTo: callbackUrl || '/dashboard',
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
