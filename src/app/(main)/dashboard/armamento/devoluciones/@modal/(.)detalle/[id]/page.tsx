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
import { getReturnById } from '@/app/(main)/dashboard/lib/actions/return'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const devolution = await getReturnById(Number(id))
  const renglones = devolution.renglones
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
          {renglones.map((renglon, index) => (
            <Card key={index} className="min-w-[300px]">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Renglón {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  Descripción: {renglon.renglon.descripcion}
                </p>
                <p className="text-sm text-foreground">
                  Cantidad: {`${renglon.seriales.length}`}
                </p>
                <p className="text-sm text-foreground">
                  Unidad de empaque: {renglon.renglon.unidad_empaque.nombre}
                </p>

                <p className="text-sm text-foreground">
                  Clasificación: {renglon.renglon.clasificacion.nombre}
                </p>

                <p className="text-sm text-foreground">
                  Seriales devueltos:
                  <ul className="list-disc ml-4">
                    {renglon.seriales.map((serial, index) => (
                      // @ts-ignore
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
