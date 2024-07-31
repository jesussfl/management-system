import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import { getOrderById } from '../../../../../../../../lib/actions/order'
import OrderStatusForm from '../../../(tabs)/@modal/(.)[id]/editar-estado/form'

export const metadata: Metadata = {
  title: 'Editar Estado del Pedido',
}

export default async function Page({ params }: { params: { id: string } }) {
  const order = await getOrderById(Number(params.id))
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/armamento/pedidos"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar Estado del Pedido
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-9 space-y-4 md:px-[40px] xl:px-[350px] 2xl:px-[550px]">
        <OrderStatusForm orderId={Number(params.id)} estado={order.estado} />
      </PageContent>
    </>
  )
}
