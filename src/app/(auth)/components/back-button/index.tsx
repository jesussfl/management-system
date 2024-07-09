'use client'

import { Button } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href: string
  label: string
}
interface BackLinkButtonProps {
  label: string
  variant?:
    | 'default'
    | 'ghost'
    | 'link'
    | 'outline'
    | 'secondary'
    | 'destructive'
    | null
}
export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="link" size="xl" asChild>
      <a className="text-[18px]" href={href}>
        {label}
      </a>
    </Button>
  )
}

export const BackLinkButton = ({ label, variant }: BackLinkButtonProps) => {
  const router = useRouter()
  return (
    <Button variant={variant} size="lg" onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
