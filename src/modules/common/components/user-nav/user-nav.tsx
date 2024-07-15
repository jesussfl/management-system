import { Button } from '@/modules/common/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { useSession, signOut } from 'next-auth/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/modules/common/components/avatar/avatar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateSections } from '@/lib/data/validate-permissions'
export default function UserNav() {
  const { data: session } = useSession()
  const [isAuthorized, setIsAuthorized] = useState(false)

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
          variant="ghost"
          className="flex justify-start gap-2 hover:bg-dark-secondary"
        >
          <Avatar className="h-8 w-8 ">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start items-start space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {session?.user?.name}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.nombre}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup></DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href={`/dashboard/contrasena-administrador`}>
          {isAuthorized && (
            <DropdownMenuItem>
              Cambiar contraseña de Administrador
            </DropdownMenuItem>
          )}
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
