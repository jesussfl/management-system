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
    <div className="flex flex-col w-full justify-center items-center gap-4 bg-gray-50">
      <Card className="w-[500px] shadow-md">
        <CardHeader>
          <Header label={headerLabel} title={headerTitle} />
        </CardHeader>
        <CardContent>{children}</CardContent>
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
