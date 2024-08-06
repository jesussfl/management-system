import { RenglonWithAllRelations } from '@/types/types'

export const getLowStockItems = (items: RenglonWithAllRelations[]) => {
  const lowStockItems = items.filter((item) => {
    const totalStock = item.stock_actual

    return totalStock < item.stock_minimo
  })

  return lowStockItems.filter(
    (item) => item.fecha_eliminacion === null
  ) as RenglonWithAllRelations[]
}
