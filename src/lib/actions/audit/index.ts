'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export const registerAuditAction = async (action: string) => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'You must be signed in to perform this action',
    }
  }

  if (!action) {
    return {
      error: 'Action is required',
    }
  }

  await prisma.auditoria.create({
    data: {
      id_usuario: session.user.id,
      accion: action,
    },
  })

  revalidatePath('/dashboard/auditoria')

  return {
    success: true,
  }
}
