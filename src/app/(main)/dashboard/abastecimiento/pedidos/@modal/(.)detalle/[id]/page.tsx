import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getOrderById } from '../../../lib/actions/orders'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { format } from 'date-fns'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getOrderById(Number(id))
  const renglones = reception.renglones
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-y-auto max-h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Detalles de la Recepción
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
                {/* <p className="text-sm text-foreground">
                  Nombre: {renglon.renglon.nombre}
                </p>
                <p className="text-sm text-foreground">
                  Codigo de solicitud:{' '}
                  {renglon.codigo_solicitud
                    ? renglon.codigo_solicitud
                    : 'Sin Código de solicitud'}
                </p>
                <p className="text-sm text-foreground">
                  Descripción: {renglon.renglon.descripcion}
                </p> */}
                <p className="text-sm text-foreground">
                  Cantidad: {`${renglon.cantidad}`}
                </p>
                {/* <p className="text-sm text-foreground">
                  Unidad de empaque: {renglon.renglon.unidad_empaque.nombre}
                </p>
                <p className="text-sm text-foreground">
                  Precio en Bs: {renglon.precio} Bs
                </p>
                <p className="text-sm text-foreground">
                  Clasificación: {renglon.renglon.clasificacion.nombre}
                </p>
                <p className="text-sm text-foreground">
                  Categoría: {renglon.renglon.categoria.nombre}
                </p>
                <p className="text-sm text-foreground">
                  Fabricante :{' '}
                  {renglon.fabricante ? renglon.fabricante : 'Sin fabricante'}
                </p>
                <p className="text-sm text-foreground">
                  Fecha fabricación:{' '}
                  {renglon.fecha_fabricacion
                    ? new Date(renglon.fecha_fabricacion)
                        .toISOString()
                        .split('T')[0]
                    : 'Sin fecha de fabricación'}
                </p>
                <p className="text-sm text-foreground">
                  Fecha vencimiento:{' '}
                  {renglon.fecha_vencimiento
                    ? new Date(renglon.fecha_vencimiento)
                        .toISOString()
                        .split('T')[0]
                    : 'Sin fecha de vencimiento'}
                </p> */}
              </CardContent>
              {/* Puedes agregar más información aquí */}
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
