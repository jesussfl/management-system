import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { ArrowDown, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import { buttonVariants } from '@/modules/common/components/button'
import ChangeAdminPasswordForm from './change-password-form'
export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="flex flex-col  shadow-md overflow-y-auto">
        <CardHeader>
          <CardTitle>Cambiar Contraseña de Administrador</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 gap-8 justify-between">
          <ChangeAdminPasswordForm />
        </CardContent>
        <CardFooter>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: 'link' }))}
          >
            Ir al inicio
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
