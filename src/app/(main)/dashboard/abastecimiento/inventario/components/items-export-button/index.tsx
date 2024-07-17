'use client'

import { Button } from '@/modules/common/components/button'
import generateExcelData from '@/utils/helpers/excel-data-generator'
import { DownloadIcon } from 'lucide-react'

function ExportExcelButton({ data }: { data: any }) {
  return (
    <Button
      variant={'outline'}
      className="mt-4"
      onClick={() => generateExcelData(data)}
    >
      Descargar Excel
      <DownloadIcon className="ml-2 h-4 w-4" />
    </Button>
  )
}

export default ExportExcelButton
