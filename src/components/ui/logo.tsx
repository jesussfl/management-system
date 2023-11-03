import Link from 'next/link'

function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 md:py-3 w-full"
    >
      <span className="h-16 w-16 bg-border rounded-lg" />
      <span className="text-foreground font-medium">Sistema de Gestión</span>
    </Link>
  )
}

export default Logo
