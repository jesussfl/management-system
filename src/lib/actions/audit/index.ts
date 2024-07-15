'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Acciones_Cortas } from '@prisma/client'

export const registerAuditAction = async (
  shortAction: Acciones_Cortas,
  action: string
) => {
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
      accion_corta: shortAction,
    },
  })

  revalidatePath('/dashboard/auditoria')

  return {
    success: true,
  }
}

export const registerAuditActionWithoutSession = async (
  shortAction: Acciones_Cortas,
  action: string,
  userId: string
) => {
  if (!action) {
    return {
      error: 'Action is required',
    }
  }

  await prisma.auditoria.create({
    data: {
      id_usuario: userId,
      accion: action,
      accion_corta: shortAction,
    },
  })

  revalidatePath('/dashboard/auditoria')

  return {
    success: true,
  }
}
