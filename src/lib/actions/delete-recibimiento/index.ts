'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
export const deleteRecibimiento = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action.')
  }

  await prisma.recepcion.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/recepciones')
}
