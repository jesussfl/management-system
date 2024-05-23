import PageForm from '@/modules/layout/components/page-form'
import WarehousesForm from '../../../almacenes/components/form'
import ButtonExport from '../../components/button-export'
import { getReceptionById } from '../../lib/actions/receptions'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const receptionData = await getReceptionById(Number(id))
  const getCode = () => {
    //Explanation: If the id only has one digit, add two zeros in front of it but if it has two digits, add one zero in front of it

    return `00${id}`.slice(-3)
  }
  const exportData = {
    destinatario_cedula: `${receptionData.destinatario?.tipo_cedula}-${receptionData.cedula_destinatario}`,
    destinatario_nombres: receptionData.destinatario?.nombres,
    destinatario_apellidos: receptionData.destinatario?.apellidos,
    destinatario_grado: receptionData?.destinatario?.grado?.nombre || 's/c',
    destinatario_cargo: receptionData.destinatario?.cargo_profesional,
    destinatario_telefono: receptionData.destinatario?.telefono,
    despacho: receptionData,
    renglones: receptionData.renglones,
    autorizador: receptionData.autorizador,
    abastecedor: receptionData.abastecedor,
    supervisor: receptionData.supervisor,
    unidad: receptionData?.destinatario?.unidad?.nombre || 's/u',
    codigo: getCode(),
    motivo: receptionData.motivo || 's/m',
  }
  return (
    <PageForm title="Exportar" backLink="/dashboard/abastecimiento/recepciones">
      <div className="flex flex-col gap-4 p-5">
        <ButtonExport data={exportData} />
      </div>
    </PageForm>
  )
}
