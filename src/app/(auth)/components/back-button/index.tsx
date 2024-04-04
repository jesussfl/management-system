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
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <a href={href}>{label}</a>
    </Button>
  )
}

export const BackLinkButton = ({ label, variant }: BackLinkButtonProps) => {
  const router = useRouter()
  return (
    <Button variant={variant} size="sm" onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
