import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getDispatchById } from '../../../lib/actions/dispatches'
import ButtonExport from '../../../components/button-export'
import { ExportData } from '../../../lib/actions/dispatches/exporting'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const dispatchData = await getDispatchById(Number(id))
  const getCode = () => {
    //Explanation: If the id only has one digit, add two zeros in front of it but if it has two digits, add one zero in front of it

    return `00${id}`.slice(-3)
  }
  const exportData = {
    destinatario_cedula: `${dispatchData.destinatario.tipo_cedula}-${dispatchData.cedula_destinatario}`,
    destinatario_nombres: dispatchData.destinatario.nombres,
    destinatario_apellidos: dispatchData.destinatario.apellidos,
    destinatario_grado: dispatchData?.destinatario?.grado?.nombre || 's/c',
    destinatario_cargo: dispatchData.destinatario.cargo_profesional,
    destinatario_telefono: dispatchData.destinatario.telefono,
    despacho: dispatchData,
    renglones: dispatchData.renglones,
    autorizador: dispatchData.autorizador,
    abastecedor: dispatchData.abastecedor,
    supervisor: dispatchData.supervisor,
    unidad: dispatchData?.destinatario?.unidad?.nombre || 's/u',
    codigo: getCode(),
    motivo: dispatchData.motivo || 's/m',
  } as ExportData
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle>Exportar Despacho</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-5">
          <ButtonExport data={exportData} />
        </div>
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}
