import { prisma } from '@/lib/prisma'
import { Renglon } from '@/types/types'
import RecibimientosFormAdd from './recibimientos-form-add'

export default async function Page() {
  const renglonesData = (await prisma.renglones.findMany()) as Renglon[]

  return (
    <div className="flex flex-col justify-between m-3 h-[calc(100vh-5rem)] bg-background rounded-sm overflow-hidden ">
      <RecibimientosFormAdd renglonesData={renglonesData} />
    </div>
  )
}
