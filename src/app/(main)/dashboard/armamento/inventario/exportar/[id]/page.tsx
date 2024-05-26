import WarehousesForm from '@/app/(main)/dashboard/abastecimiento/almacenes/components/form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm
      title="Exportar despacho"
      backLink="/dashboard/armamento/inventario"
    >
      <WarehousesForm />
    </PageForm>
  )
}
