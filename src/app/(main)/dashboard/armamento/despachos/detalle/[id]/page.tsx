import PageForm from '@/modules/layout/components/page-form'
import { getDispatchById } from '../../lib/actions/dispatches'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getDispatchById(Number(id))
  const renglones = reception?.renglones

  return (
    <PageForm
      title="Ver detalle de despachos realizados"
      backLink="/dashboard/armamento/despachos"
    >
      {renglones.map((renglon, index) => (
        <div key={index}>
          <h2>Renglón {index + 1}</h2>

          <p>Nombre: {renglon.renglon.nombre}</p>
          <p>Cantidad: {`${renglon.cantidad}`}</p>

          <p>Unidad de empaque: {renglon.renglon.unidad_empaque.nombre}</p>

          <p className="text-sm text-foreground">
            Seriales despachados:
            <ul className="list-disc ml-4">
              {renglon.seriales.map((serial, index) => (
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
