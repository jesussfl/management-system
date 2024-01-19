'use server'

import * as z from 'zod'

import { ResetSchema } from '@/utils/schemas'
import { getUserByEmail } from '@/lib/data/get-user-byEmail'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid emaiL!' }
  }

  const { email } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    console.log('Email not found!')
    return { error: 'Email not found!' }
  }

  try {
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    )
    return { success: 'Reset email sent!', expires: passwordResetToken.expires }
  } catch (error) {
    console.log(error)
    return {
      error:
        'Ya ha sido enviado un link a este correo, por favor revise su bandeja de entrada',
    }
  }
}
