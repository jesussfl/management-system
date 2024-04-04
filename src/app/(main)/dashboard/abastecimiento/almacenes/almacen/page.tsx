import PageForm from '@/modules/layout/components/page-form'
import WarehousesForm from '../components/form/'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Almacén"
      backLink="/dashboard/abastecimiento/almacenes"
    >
      <WarehousesForm />
    </PageForm>
  )
}
