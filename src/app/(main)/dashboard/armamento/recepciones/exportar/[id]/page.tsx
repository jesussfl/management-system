import PageForm from '@/modules/layout/components/page-form'

import FormatSelector from '@/modules/common/components/format-selector'
import { getReceptionForExportGuide } from '@/app/(main)/dashboard/lib/actions/reception'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getReceptionForExportGuide(Number(id))

  return (
    <PageForm title="Exportar" backLink="/dashboard/armamento/recepciones">
      <div className="flex flex-col gap-4 justify-center items-center">
        <FormatSelector data={guideData} type="recepcion" />
      </div>
    </PageForm>
  )
}
