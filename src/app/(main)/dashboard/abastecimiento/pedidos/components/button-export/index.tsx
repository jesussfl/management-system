'use client'

import { Button } from '@/modules/common/components/button'
import { FileDown } from 'lucide-react'
import { exportDocumentNew } from '../../lib/actions/orders/exporting'
export default function ButtonExport({ data }: any) {
  const transformedData = {
    ...data,

    renglones: data.renglones.map((renglon: any) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial: any) => serial.serial),
    })),
  }
  return (
    <Button
      variant="outline"
      size={'sm'}
      onClick={() => exportDocumentNew(transformedData)}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar Guía de Recepción
    </Button>
  )
}
