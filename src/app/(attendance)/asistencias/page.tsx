import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="flex flex-col  shadow-md overflow-y-auto">
        <CardHeader>
          <CardTitle>Control de Asistencias</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 gap-8 justify-between">
          <Link
            href="/asistencias/entrada"
            className={buttonVariants({ variant: 'default' })}
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Registrar Hora de Entrada
          </Link>

          <Link
            href="/asistencias/salida"
            className={buttonVariants({ variant: 'destructive' })}
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Registrar Hora de Salida
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
