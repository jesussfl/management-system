import PageForm from '@/modules/layout/components/page-form'
import WarehousesForm from '../../../almacenes/components/form'

export default async function Page() {
  return (
    <PageForm
      title="Exportar despacho"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <WarehousesForm />
    </PageForm>
  )
}
