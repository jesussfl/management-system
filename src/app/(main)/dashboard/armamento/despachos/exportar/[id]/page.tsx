import PageForm from '@/modules/layout/components/page-form'
import FormatSelector from '@/modules/common/components/format-selector'
import { getDispatchForExportGuide } from '@/lib/actions/dispatch'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getDispatchForExportGuide(Number(id))

  return (
    <PageForm
      title="Exportar despacho"
      backLink="/dashboard/armamento/despachos"
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <FormatSelector data={guideData} type="despacho" />
      </div>
    </PageForm>
  )
}
