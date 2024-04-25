// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/modules/common/components/dropdown-menu/dropdown-menu'

// import { Button } from '@/modules/common/components/button'
// import { MoreHorizontal } from 'lucide-react'
// import { Permiso, Prisma } from '@prisma/client'
// import { getAllPermissions } from '@/app/(main)/dashboard/usuarios/lib/actions/permissions'

// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from '@/modules/common/components/dialog/dialog'
// import { useEffect, useState } from 'react'

// import DeleteDialog from '../roles-delete-dialog'
// import RolesForm from '../roles-form'
// type Rol = Prisma.RolGetPayload<{ include: { permisos: true } }>

// type Props = {
//   rol: Rol
// }

// export default function TableActions({ rol }: Props) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [dialogType, setDialogType] = useState('')
//   const [permissions, setPermissions] = useState<Permiso[]>([])
//   useEffect(() => {
//     getAllPermissions().then((data) => {
//       setPermissions(data)
//     })
//   }, [rol])
//   const toggleModal = () => setIsOpen(!isOpen)
//   return (
//     <Dialog open={isOpen} onOpenChange={toggleModal}>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Abrir Menú</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
//           <DropdownMenuItem
//             onClick={() => navigator.clipboard.writeText(String(rol.id))}
//           >
//             Copiar código
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />

//           <DialogTrigger asChild onClick={() => setDialogType('edit')}>
//             <DropdownMenuItem>Editar</DropdownMenuItem>
//           </DialogTrigger>
//           <DialogTrigger asChild onClick={() => setDialogType('delete')}>
//             <DropdownMenuItem>Eliminar</DropdownMenuItem>
//           </DialogTrigger>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       {dialogType === 'edit' ? (
//         <DialogContent className={'lg:max-w-screen-lg overflow-hidden p-0'}>
//           <RolesForm
//             defaultValues={rol}
//             close={toggleModal}
//             permissions={permissions}
//           />
//         </DialogContent>
//       ) : (
//         <DeleteDialog rol={rol} close={toggleModal} />
//       )}
//     </Dialog>
//   )
// }
