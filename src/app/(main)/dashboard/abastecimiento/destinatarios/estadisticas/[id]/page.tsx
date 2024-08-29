import PageForm from '@/modules/layout/components/page-form'

import { ItemsChart } from '../../lib/actions/receivers/dispatched-items-chart'
import { getDispatchesByReceiver } from '../../../../../../../lib/actions/dispatch/stats'
import { getReceptionsByReceiver } from '@/lib/actions/reception/stats'
import { getReturnsByReceiver } from '@/lib/actions/return/stats'
import { getLoansByReceiver } from '@/lib/actions/loan/stats'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <PageForm
      title="Ver estadisticas"
      backLink="/dashboard/abastecimiento/despachos"
    >
      <div className="grid grid-cols-2 gap-4">
        <ItemsChart
          id={Number(id)}
          // @ts-ignore
          dataFetcher={getDispatchesByReceiver}
          chartTitle="Renglones Despachados"
          color="#ed8936"
        />
        <ItemsChart
          id={Number(id)}
          // @ts-ignore
          dataFetcher={getReceptionsByReceiver}
          chartTitle="Renglones Entregados"
          color="#4299e1"
        />
        <ItemsChart
          id={Number(id)}
          // @ts-ignore
          dataFetcher={getReturnsByReceiver}
          chartTitle="Renglones Devueltos"
          color="#f56565"
        />
        <ItemsChart
          id={Number(id)}
          // @ts-ignore
          dataFetcher={getLoansByReceiver}
          chartTitle="Renglones Prestados"
          color="#48bb78"
        />
      </div>
    </PageForm>
  )
}
