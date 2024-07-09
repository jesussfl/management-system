'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export const getAllAuditItems = async () => {
  const session = await auth()

  if (!session?.user) {
    revalidatePath('/')
  }

  const auditItems = await prisma.auditoria.findMany({
    orderBy: {
      fecha_realizado: 'desc',
    },
    include: {
      usuario: true,
    },
  })

  return auditItems
}

export const getAllAuditItemsByUser = async (userId: string) => {
  const session = await auth()

  if (!session?.user) {
    revalidatePath('/')
  }

  if (!userId) {
    return []
  }

  const auditItems = await prisma.auditoria.findMany({
    orderBy: {
      fecha_realizado: 'desc',
    },
    where: {
      id_usuario: userId,
    },
    include: {
      usuario: true,
    },
  })

  return auditItems
}
