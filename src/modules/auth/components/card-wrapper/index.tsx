'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/modules/common/components/card/card'
import { Header } from '@/modules/auth/components/header'
import { Social } from '@/modules/auth/components/social'
import { BackButton } from '@/modules/auth/components/back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerTitle?: string
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  headerTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className="flex flex-col w-full gap-4 lg:justify-center lg:items-center bg-gray-50">
      <Card className="flex flex-col h-full lg:w-[500px] shadow-md overflow-y-auto">
        <CardHeader>
          <Header label={headerLabel} title={headerTitle} />
        </CardHeader>
        <CardContent className="flex-1">{children}</CardContent>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  )
}
