'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Renglon } from '@prisma/client'
export type ReceptionsByReceiver = Prisma.PromiseReturnType<
  typeof getReceptionsByReceiver
>
export type DateRange = { from: Date | null; to: Date | null }
export const getReceptionsByReceiver = async ({
  id,
  dateRange,
  dispatchType,
}: {
  id: number
  dispatchType: 'unidad' | 'liquidos'
  dateRange: DateRange
}) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const receiver = await prisma.destinatario.findUnique({
    where: {
      id,
    },
    include: {
      recepciones: {
        where: {
          fecha_eliminacion: null,
          fecha_recepcion: {
            gte: dateRange.from ? dateRange.from : undefined,
            lte: dateRange.to ? dateRange.to : undefined,
          },
        },
        include: {
          renglones: {
            include: {
              renglon: true,
            },
          },
        },
      },
    },
  })

  if (!receiver) {
    throw new Error('Receiver not found')
  }

  // Acumulamos las cantidades despachadas por ítem
  const itemsReceivedWithQuantity = receiver.recepciones.reduce(
    (
      acc: { id: number; itemData: Renglon; totalQuantity: number }[],
      reception
    ) => {
      reception.renglones.forEach((receptionDetail) => {
        const { renglon, cantidad } = receptionDetail

        const existingItem = acc.find((item) => item.id === renglon.id)

        if (existingItem) {
          existingItem.totalQuantity += cantidad
        } else {
          acc.push({
            id: renglon.id,
            itemData: renglon,
            totalQuantity: cantidad,
          })
        }
      })

      return acc
    },
    []
  )

  console.log(itemsReceivedWithQuantity)
  return itemsReceivedWithQuantity
}
