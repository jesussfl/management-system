import PageForm from '@/modules/layout/components/page-form'
import { getLoanForExportGuide } from '@/lib/actions/loan'
import FormatSelector from '@/modules/common/components/format-selector'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getLoanForExportGuide(Number(id))

  return (
    <PageForm
      title="Exportar prestamo"
      backLink="/dashboard/abastecimiento/prestamos"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <FormatSelector data={guideData} type="prestamo" />
      </div>
    </PageForm>
  )
}
