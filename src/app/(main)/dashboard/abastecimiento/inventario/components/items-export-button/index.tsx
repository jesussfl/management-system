'use client'

import { Button } from '@/modules/common/components/button'
import { Renglon } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getAllItems } from '../../lib/actions/items'
import downloadExcelFile from '@/utils/helpers/download-excel'
import generateExcelData from '@/utils/helpers/excel-data-generator'

function ExportExcelButton() {
  const [items, setItems] = useState<Renglon[]>([])

  useEffect(() => {
    const getItems = async () => {
      const items = await getAllItems()

      setItems(items)
    }

    getItems()
  }, [])
  return (
    <Button variant={'outline'} onClick={() => generateExcelData(items)}>
      Exportar en excel
    </Button>
  )
}

export default ExportExcelButton
