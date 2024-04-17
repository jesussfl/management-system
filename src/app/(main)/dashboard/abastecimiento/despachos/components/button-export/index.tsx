'use client'

import { exportDocumentNew } from '@/app/(main)/dashboard/abastecimiento/despachos/lib/actions/dispatches/exporting'
import { Button } from '@/modules/common/components/button'
import { FileDown } from 'lucide-react'
export default function ButtonExport({ data }: any) {
  return (
    <Button
      variant="outline"
      size={'sm'}
      onClick={() => exportDocumentNew(data)}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar
    </Button>
  )
}
