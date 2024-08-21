import PageForm from '@/modules/layout/components/page-form'
import { getLoanById } from '@/lib/actions/loan'
import { DispatchedItemDetails } from '@/app/(main)/dashboard/components/received-item-details/received-item-details'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const loan = await getLoanById(Number(id))
  const loanDetails = loan?.renglones

  return (
    <PageForm
      title="Ver detalle de prestamos realizados"
      backLink="/dashboard/abastecimiento/prestamos"
    >
      {loanDetails.map((detail, index) => (
        <DispatchedItemDetails key={index} data={detail} />
      ))}
    </PageForm>
  )
}
