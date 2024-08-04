import PageForm from '@/modules/layout/components/page-form'

import { getReturnById } from '../../../../../../../lib/actions/return'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const devolution = await getReturnById(Number(id))
  const devolutionDetails = devolution?.renglones

  return (
    <PageForm
      title="Ver detalle de renglones recibidos"
      backLink="/dashboard/abastecimiento/inventario"
    >
      {devolutionDetails.map((detail, index) => (
        <div key={index}>
          <h2>Renglón {index + 1}</h2>
          <p>Descripción: {detail.renglon.descripcion}</p>
          <p>Cantidad: {`${detail.seriales.length}`}</p>
          <p>
            Unidad de empaque:{' '}
            {detail?.renglon.unidad_empaque?.nombre || 'Sin Empaque'}
          </p>
          <p>Clasificación: {detail.renglon.clasificacion.nombre}</p>
        </div>
      ))}
    </PageForm>
  )
}
