import { utils, writeFile } from 'xlsx'

function generateExcelData(data: any) {
  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  const excelData = writeFile(workbook, 'products.xlsx', {
    compression: true,
  })
  return excelData
}

export default generateExcelData
