import { FilterFn } from '@tanstack/react-table'

export const dateBetweenFilterFn: FilterFn<any> = (row, columnId, value) => {
  const date = row.getValue(columnId) as Date

  const { from, to } = value // value => two date input values
  //If one filter defined and date is null filter it
  if ((from || to) && !date) return false
  if (from && !to) {
    return date.getTime() >= from.getTime()
  } else if (!from && to) {
    return date.getTime() <= to.getTime()
  } else if (from && to) {
    return date.getTime() >= from.getTime() && date.getTime() <= to.getTime()
  } else return true
}

dateBetweenFilterFn.autoRemove

export default dateBetweenFilterFn
