import { Button } from '@/modules/common/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateSections } from '@/lib/data/validate-permissions'
import { FileLock2, LogOut, UserCircle2 } from 'lucide-react'
import { useSidebarContext } from '@/lib/context/sidebar-context'
export default function UserNav() {
  const { data: session } = useSession()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { isCollapsed, setCollapsed: setSidebarCollapsed } = useSidebarContext()

  useEffect(() => {
    const validateKeys = async () => {
      const isAuthorized = await validateSections({
        sections: [SECTION_NAMES.TODAS],
      })

      setIsAuthorized(isAuthorized)
    }

    validateKeys()
  }, [])
  //check if user has a permission with the key "TODAS:FULL"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="flex w-full justify-start gap-2 text-white"
        >
          <UserCircle2 className="h-6 w-6" />
          {!isCollapsed && (
            <div className="flex flex-col text-left space-y-1">
              <p className="text-sm font-medium text-white leading-none">
                {session?.user?.nombre}
              </p>
              <p className="text-xs leading-none text-gray-200">
                {`Rol: ${session?.user?.rol_nombre}`}
              </p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <Link href={`/dashboard/contrasena-administrador`}>
          {isAuthorized && (
            <DropdownMenuItem>
              <FileLock2 className="mr-2 h-6 w-6" />
              Cambiar contraseña de Administrador
            </DropdownMenuItem>
          )}
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
