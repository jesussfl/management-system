import PageForm from '@/modules/layout/components/page-form'
import { getDispatchById } from '@/lib/actions/dispatch'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const dispatch = await getDispatchById(Number(id))
  const dispatchDetails = dispatch?.renglones

  return (
    <PageForm
      title="Ver detalle de despachos realizados"
      backLink="/dashboard/abastecimiento/despachos"
    >
      {dispatchDetails.map((detail, index) => (
        <div key={index}>
          <h2>Renglón {index + 1}</h2>

          <p>Nombre: {detail.renglon.nombre}</p>
          <p>Cantidad: {`${detail.cantidad}`}</p>

          <p className="text-sm text-foreground">
            Unidad de Empaque:
            {detail?.renglon.unidad_empaque?.nombre || 'Sin Empaque'}
          </p>

          <p className="text-sm text-foreground">
            Seriales despachados:
            <ul className="list-disc ml-4">
              {detail.seriales.map((serial, index) => (
                <li key={index}>{serial}</li>
              ))}
            </ul>
          </p>
          {/* Puedes agregar más información aquí */}
        </div>
      ))}
    </PageForm>
  )
}
