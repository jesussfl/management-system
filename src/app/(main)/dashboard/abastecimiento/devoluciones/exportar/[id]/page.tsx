import PageForm from '@/modules/layout/components/page-form'
import { getLoanForExportGuide } from '@/lib/actions/loan'
import FormatSelector from '@/modules/common/components/format-selector'
import { getReturnForExportGuide } from '@/lib/actions/return'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getReturnForExportGuide(Number(id))

  return (
    <PageForm
      title="Exportar prestamo"
      backLink="/dashboard/abastecimiento/devoluciones"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <FormatSelector data={guideData} type="devolucion" />
      </div>
    </PageForm>
  )
}
