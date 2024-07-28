import PageForm from '@/modules/layout/components/page-form'

import { getReturnById } from '../../../../lib/actions/return'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const devolution = await getReturnById(Number(id))
  const renglones = devolution?.renglones

  return (
    <PageForm
      title="Ver detalle de renglones recibidos"
      backLink="/dashboard/abastecimiento/inventario"
    >
      {renglones.map((renglon, index) => (
        <div key={index}>
          <h2>Renglón {index + 1}</h2>
          <p>Descripción: {renglon.renglon.descripcion}</p>
          <p>Cantidad: {`${renglon.seriales.length}`}</p>
          <p>Unidad de empaque: {renglon.renglon.unidad_empaque.nombre}</p>
          <p>Clasificación: {renglon.renglon.clasificacion.nombre}</p>
          <p>Categoría: {renglon.renglon.categoria.nombre}</p>
        </div>
      ))}
    </PageForm>
  )
}
