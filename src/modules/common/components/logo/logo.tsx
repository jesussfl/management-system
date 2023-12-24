import Link from 'next/link'

function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex flex-col gap-4 justify-center w-full pt-4 mb-8"
    >
      <span className="h-8 w-8 bg-border rounded-lg" />
      <div className="flex flex-col gap-0">
        <p className="text-muted-foreground font-regular text-xs">
          {' '}
          Sistema de Gestión{' '}
        </p>
        <span className="text-foreground font-medium text-sm">CESERLODAI</span>
      </div>
    </Link>
  )
}

export default Logo
