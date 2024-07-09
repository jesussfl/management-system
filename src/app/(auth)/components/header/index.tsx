import { Poppins } from 'next/font/google'

import { cn } from '@/utils/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

interface HeaderProps {
  title?: string
  label: string
  error?: boolean
}

export const Header = ({ title, label, error }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn('text-3xl font-semibold', font.className)}>
        {title || '🔐 Autenticación'}
      </h1>
      <p
        className={`text-muted-foreground text-md ${
          error ? 'text-red-500' : ''
        }`}
      >
        {label}
      </p>
    </div>
  )
}
