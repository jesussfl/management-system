import { getSerialsCountByItemId } from '@/lib/actions/serials'

export const getStock = async (id: number) => {
  const stock = await getSerialsCountByItemId(id)
  // console.log(stock)
  return stock
}
