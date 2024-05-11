import { ArrowDown, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import { CardWrapper } from '@/app/(auth)/components/card-wrapper'
import Ceserlodai from '@public/ceserlodai.jpg'

import Image from 'next/image'
export default function Page() {
  return (
    <div className="flex flex-col-reverse p-4 h-full lg:min-h-screen lg:max-h-screen lg:flex-row lg:p-8 md:p-5 bg-gray-50">
      <div className="relative flex flex-1 w-[100px] rounded-md">
        <Image
          fill={true}
          style={{ objectFit: 'cover' }}
          src={Ceserlodai}
          alt="background"
          className="rounded-lg"
        />
      </div>
      <div className="flex lg:flex-1">
        <CardWrapper
          headerTitle="Control de Asistencias"
          headerLabel="Ingresa tu hora de entrada o salida"
        >
          <div className="flex justify-between gap-4">
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
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}
