'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Renglon } from '@prisma/client'
export type ReturnsByReceiver = Prisma.PromiseReturnType<
  typeof getReturnsByReceiver
>
export type DateRange = { from: Date | null; to: Date | null }
export const getReturnsByReceiver = async ({
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
      devoluciones: {
        where: {
          fecha_eliminacion: null,
          fecha_devolucion: {
            gte: dateRange.from ? dateRange.from : undefined,
            lte: dateRange.to ? dateRange.to : undefined,
          },
        },
        include: {
          renglones: {
            include: {
              seriales: true,
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
  const itemsReturnedWithQuantity = receiver.devoluciones.reduce(
    (
      acc: { id: number; itemData: Renglon; totalQuantity: number }[],
      devolution
    ) => {
      devolution.renglones.forEach((devolutionDetail) => {
        const { renglon, seriales } = devolutionDetail

        const existingItem = acc.find((item) => item.id === renglon.id)

        if (existingItem) {
          existingItem.totalQuantity += seriales.length
        } else {
          acc.push({
            id: renglon.id,
            itemData: renglon,
            totalQuantity: seriales.length,
          })
        }
      })

      return acc
    },
    []
  )

  console.log(itemsReturnedWithQuantity)
  return itemsReturnedWithQuantity
}
