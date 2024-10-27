'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Renglon } from '@prisma/client'
export type DispatchesByReceiver = Prisma.PromiseReturnType<
  typeof getDispatchesByReceiver
>
export type DateRange = { from: Date | null; to: Date | null }
export const getDispatchesByReceiver = async ({
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
  const es_despacho_liquidos = dispatchType === 'liquidos'
  const receiver = await prisma.destinatario.findUnique({
    where: {
      id,
    },
    include: {
      despachos: {
        where: {
          fecha_eliminacion: null,
          fecha_despacho: {
            gte: dateRange.from ? dateRange.from : undefined,
            lte: dateRange.to ? dateRange.to : undefined,
          },
          renglones: {
            some: {
              es_despacho_liquidos,
            },
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
  const itemsDispatchedWithQuantity = receiver.despachos.reduce(
    (
      acc: { id: number; itemData: Renglon; totalQuantity: number }[],
      dispatch
    ) => {
      dispatch.renglones.forEach((dispatchDetail) => {
        const { renglon, cantidad } = dispatchDetail

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

  // console.log(itemsDispatchedWithQuantity)
  return itemsDispatchedWithQuantity
}
