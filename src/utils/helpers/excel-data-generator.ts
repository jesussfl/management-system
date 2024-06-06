import { utils, writeFile, WorkSheet } from 'xlsx'

function generateExcelData(data: any) {
  const jsonKeys = Object.keys(data[0])

  let objectMaxLength: any[] = []
  for (let i = 0; i < data.length; i++) {
    let value = data[i]
    for (let j = 0; j < jsonKeys.length; j++) {
      if (typeof value[jsonKeys[j]] == 'number') {
        objectMaxLength[j] = 10
      } else {
        const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0

        objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l
      }
    }

    let key = jsonKeys
    for (let j = 0; j < key.length; j++) {
      objectMaxLength[j] =
        objectMaxLength[j] >= key[j].length ? objectMaxLength[j] : key[j].length
    }
  }

  const wscols = objectMaxLength.map((w) => {
    return { width: w }
  })

  const worksheet: WorkSheet = utils.json_to_sheet(data)
  worksheet['!cols'] = wscols

  // const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  const excelData = writeFile(workbook, 'Reporte_Filtrado.xlsx', {
    compression: true,
  })
  return excelData
}

export default generateExcelData
