import PageForm from '@/modules/layout/components/page-form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { format } from 'date-fns'
import { getOrderById } from '../../lib/actions/orders'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getOrderById(Number(id))
  const renglones = reception?.renglones

  return (
    <PageForm
      title="Ver detalle de renglones recibidos"
      backLink="/dashboard/abastecimiento/inventario"
    >
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
    </PageForm>
  )
}
