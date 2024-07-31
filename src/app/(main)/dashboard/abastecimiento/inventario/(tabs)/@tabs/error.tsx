'use client'

import { Button } from '@/modules/common/components/button'
import { PageTemplate } from '@/modules/layout/templates/page'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (error.message === 'Unauthorized') {
    return (
      <PageTemplate className="flex justify-center items-center h-[90vh]">
        {' '}
        <div className="flex flex-col text-center w-[600px] gap-4 text-gray-700">
          <h1 className="text-4xl font-bold leading-[3rem]">
            Oh... No tienes permisos para acceder a esta sección.
          </h1>
          <p className="text-md text-gray-500 leading-7">
            Lo sentimos la página a la que intentabas acceder solo está
            permitida para personal autorizado. Solicita a un administrador los
            permisos correspondientes.
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: 'default' })}
          >
            Volver al inicio
          </Link>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate className="flex justify-center items-center h-[90vh]">
      {' '}
      <div className="flex flex-col text-center w-[600px] gap-4 text-gray-700">
        <h1 className="text-3xl font-bold ">Algo salió mal.</h1>
        <p className="text-md text-gray-500">{error.message}</p>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: 'default' })}
        >
          Volver al inicio
        </Link>
      </div>
    </PageTemplate>
  )
}
