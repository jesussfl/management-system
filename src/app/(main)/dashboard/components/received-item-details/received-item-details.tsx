'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Package } from 'lucide-react'
import { AlertDialogImage } from '@/modules/common/components/alert-dialog/alert-dialog-image'
export const ReceivedItemDetails = ({
  data,
  key,
}: {
  data: any
  key: number
}) => {
  return (
    <Card key={key} className="w-[300px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          {!data.renglon.imagen ? (
            <Package className="h-8 w-12" />
          ) : (
            <AlertDialogImage imageUrl={data.renglon.imagen} />
          )}
          <div className="flex flex-col">
            <CardTitle className="text-md font-medium text-foreground">
              {data.renglon.nombre} -{' '}
              {data.renglon.unidad_empaque?.nombre || 'Sin empaque'}
            </CardTitle>
            <CardDescription>{data.renglon.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!data.es_recepcion_liquidos ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-foreground">
              Codigo de solicitud:{' '}
              {data.codigo_solicitud
                ? data.codigo_solicitud
                : 'Sin Código de solicitud'}
            </p>

            <p className="text-sm text-foreground">
              Cantidad: {`${data.cantidad}`}
            </p>

            <p className="text-sm text-foreground">
              Precio en Bs: {data.precio} Bs
            </p>
            <p className="text-sm text-foreground">
              Fabricante :{' '}
              {data.fabricante ? data.fabricante : 'Sin fabricante'}
            </p>
            <p className="text-sm text-foreground">
              Fecha fabricación:{' '}
              {data.fecha_fabricacion
                ? new Date(data.fecha_fabricacion).toISOString().split('T')[0]
                : 'Sin fecha de fabricación'}
            </p>
            <p className="text-sm text-foreground">
              Fecha vencimiento:{' '}
              {data.fecha_vencimiento
                ? new Date(data.fecha_vencimiento).toISOString().split('T')[0]
                : 'Sin fecha de vencimiento'}
            </p>
          </div>
        ) : null}

        <p className="mt-4 text-sm text-foreground">
          Seriales:
          <ul className="ml-4 list-disc">
            {data.seriales.map((serial: any, index: any) => {
              if (data.es_recepcion_liquidos) {
                return (
                  <li
                    key={index}
                  >{`${serial.serial} - peso recibido: ${serial.peso_recibido} ${data.renglon.tipo_medida_unidad}`}</li>
                )
              }

              return (
                <li key={index}>{`${serial.serial} - ${serial.condicion}`}</li>
              )
            })}
          </ul>
        </p>
      </CardContent>
    </Card>
  )
}
export const DispatchedItemDetails = ({
  data,
  key,
}: {
  data: any
  key: number
}) => {
  return (
    <Card key={key} className="w-[300px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          {!data.renglon.imagen ? (
            <Package className="h-8 w-12" />
          ) : (
            <AlertDialogImage imageUrl={data.renglon.imagen} />
          )}
          <div className="flex flex-col">
            <CardTitle className="text-md font-medium text-foreground">
              {data.renglon.nombre} -{' '}
              {data.renglon.unidad_empaque?.nombre || 'Sin empaque'}
            </CardTitle>
            <CardDescription>{data.renglon.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!data.es_recepcion_liquidos ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-foreground">
              Codigo de solicitud:{' '}
              {data.codigo_solicitud
                ? data.codigo_solicitud
                : 'Sin Código de solicitud'}
            </p>

            <p className="text-sm text-foreground">
              Cantidad: {`${data.cantidad}`}
            </p>

            <p className="text-sm text-foreground">
              Precio en Bs: {data.precio} Bs
            </p>
            <p className="text-sm text-foreground">
              Fabricante :{' '}
              {data.fabricante ? data.fabricante : 'Sin fabricante'}
            </p>
            <p className="text-sm text-foreground">
              Fecha fabricación:{' '}
              {data.fecha_fabricacion
                ? new Date(data.fecha_fabricacion).toISOString().split('T')[0]
                : 'Sin fecha de fabricación'}
            </p>
            <p className="text-sm text-foreground">
              Fecha vencimiento:{' '}
              {data.fecha_vencimiento
                ? new Date(data.fecha_vencimiento).toISOString().split('T')[0]
                : 'Sin fecha de vencimiento'}
            </p>
          </div>
        ) : null}

        <p className="mt-4 text-sm text-foreground">
          Seriales:
          <ul className="ml-4 list-disc">
            {data.seriales.map((serial: any, index: any) => {
              if (data.es_despacho_liquidos) {
                return (
                  <li
                    key={index}
                  >{`${serial.serial} - peso despachado: ${serial.peso_despachado} ${data.renglon.tipo_medida_unidad}`}</li>
                )
              }

              return <li key={index}>{`${serial.serial}`}</li>
            })}
          </ul>
        </p>
      </CardContent>
    </Card>
  )
}
