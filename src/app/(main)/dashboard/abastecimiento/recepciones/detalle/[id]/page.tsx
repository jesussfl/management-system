import PageForm from '@/modules/layout/components/page-form'
import { getReceptionById } from '../../lib/actions/receptions'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getReceptionById(Number(id))
  const renglones = reception?.renglones

  return (
    <PageForm
      title="Ver detalle de renglones recibidos"
      backLink="/dashboard/abastecimiento/inventario"
    >
      {renglones.map((renglon, index) => (
        <div key={index}>
          <h2>Renglón {index + 1}</h2>
          <p>Descripción: {renglon.renglon.descripcion}</p>
          <p>Cantidad: {`${renglon.cantidad}`}</p>
          <p>Unidad de empaque: {renglon.renglon.unidad_empaque.nombre}</p>
          <p>Costo unitario: {renglon.precio}</p>
          <p>Clasificación: {renglon.renglon.clasificacion.nombre}</p>
          <p>Categoría: {renglon.renglon.categoria.nombre}</p>
          <p>
            Serial: {renglon.seriales.map((serial) => serial.serial).join(', ')}
          </p>
          {/* Puedes agregar más información aquí */}
        </div>
      ))}
    </PageForm>
  )
}
