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
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="flex flex-col overflow-y-auto shadow-md">
        <CardHeader>
          <CardTitle>Cambiar Contraseña de Administrador</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 justify-between gap-8">
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
