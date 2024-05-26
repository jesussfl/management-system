import PageForm from '@/modules/layout/components/page-form'
import { getDispatchForExportGuide } from '../../lib/actions/dispatches'
import FormatSelector from '@/modules/common/components/format-selector'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getDispatchForExportGuide(Number(id))

  return (
    <PageForm
      title="Exportar despacho"
      backLink="/dashboard/abastecimiento/despachos"
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <FormatSelector data={guideData} type="despacho" />
      </div>
    </PageForm>
  )
}
