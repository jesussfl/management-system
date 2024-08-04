import { RenglonWithAllRelations } from '@/types/types'

export const getLowStockItems = (items: RenglonWithAllRelations[]) => {
  const lowStockItems = items.filter((item) => {
    const stock = item.recepciones.reduce(
      (total, item) => total + item.cantidad,
      0
    )
    const dispatchedSerials = item.despachos.reduce(
      (total, item) => total + item.seriales.length,
      0
    )
    const returnedSerials = item.devoluciones.reduce(
      (total, item) => total + item.seriales.length,
      0
    )

    const totalStock = stock - dispatchedSerials + returnedSerials

    return totalStock < item.stock_minimo
  })

  return lowStockItems as RenglonWithAllRelations[]
}
