'use client'

import Link from 'next/link'

import { Button } from '@/modules/common/components/button'

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <a href={href}>{label}</a>
    </Button>
  )
}
