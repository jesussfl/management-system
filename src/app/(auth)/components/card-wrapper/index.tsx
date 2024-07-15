'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/modules/common/components/card/card'
import { Header } from '@/app/(auth)/components/header'
import { Social } from '@/app/(auth)/components/social'
import { BackButton } from '@/app/(auth)/components/back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerTitle?: string
  headerLabel: string
  backButtonLabel?: string
  backButtonHref?: string
  showSocial?: boolean
  error?: boolean
}

export const CardWrapper = ({
  error = false,
  children,
  headerTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className="flex flex-col w-full gap-4 lg:justify-center lg:items-center bg-gray-50">
      <Card className="flex flex-col h-full lg:w-[600px] shadow-md overflow-y-auto">
        <CardHeader>
          <Header error={error} label={headerLabel} title={headerTitle} />
        </CardHeader>
        <CardContent className="flex-1">{children}</CardContent>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
        {backButtonHref && backButtonLabel && (
          <CardFooter className="flex justify-between">
            <BackButton label={backButtonLabel} href={backButtonHref} />
            {/* <Link
            href="/asistencias"
            className={cn(buttonVariants({ variant: 'link' }))}
          >
            Ir al Control de Asistencias
          </Link> */}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
