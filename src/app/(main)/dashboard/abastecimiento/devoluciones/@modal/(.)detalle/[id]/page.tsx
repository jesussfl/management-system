import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import Link from 'next/link'
import { getReturnById } from '../../../../../../../../lib/actions/return'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const devolution = await getReturnById(Number(id))
  const devolutionDetails = devolution.renglones
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-y-auto max-h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Detalles de la devolució́n
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devolutionDetails.map((detail, index) => (
            <Card key={index} className="min-w-[300px]">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Renglón {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  Descripción: {detail.renglon.descripcion}
                </p>
                <p className="text-sm text-foreground">
                  Cantidad: {`${detail.seriales.length}`}
                </p>
                <p className="text-sm text-foreground">
                  Unidad de empaque:{' '}
                  {detail?.renglon.unidad_empaque?.nombre || 'Sin Empaque'}
                </p>

                <p className="text-sm text-foreground">
                  Clasificación: {detail.renglon.clasificacion.nombre}
                </p>

                <p className="text-sm text-foreground">
                  Seriales devueltos:
                  <ul className="list-disc ml-4">
                    {detail.seriales.map((serial, index) => (
                      <li key={index}>{serial}</li>
                    ))}
                  </ul>
                </p>
              </CardContent>
              {/* Puedes agregar más información aquí */}
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
