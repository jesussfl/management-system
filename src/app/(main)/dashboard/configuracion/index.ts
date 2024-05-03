'use server'
import { prisma } from '@/lib/prisma'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
export const getAllImages = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const images = await prisma.image.findMany()

  return images
}
