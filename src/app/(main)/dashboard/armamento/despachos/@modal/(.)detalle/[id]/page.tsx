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
import { getDispatchById } from '@/lib/actions/dispatch'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const dispatch = await getDispatchById(Number(id))
  const renglones = dispatch.renglones
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={
          'w-[80vw] md:w-[60vw] lg:w-[60vw] overflow-y-auto max-h-[90vh]'
        }
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Detalles del despacho
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renglones.map((renglon, index) => (
            <Card key={index} className="min-w-[200px]">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Renglón {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  Nombre: {`${renglon.renglon.nombre}`}
                </p>
                <p className="text-sm text-foreground">
                  Cantidad: {`${renglon.cantidad}`}
                </p>

                <p className="text-sm text-foreground">
                  Unidad de medida: {renglon.renglon.unidad_empaque.nombre}
                </p>

                <p className="text-sm text-foreground">
                  Seriales despachados:
                  <ul className="list-disc ml-4">
                    {renglon.seriales.map((serial, index) => (
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
