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
    include: {
      usuario: true,
    },
  })

  return auditItems
}
