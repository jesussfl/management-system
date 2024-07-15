// 'use client'

// import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
// import { es } from 'date-fns/locale'
// import { Prisma } from '@prisma/client'
// import { useStore } from '@/lib/hooks/custom-use-store'

// import { useAllAuditFilterStore } from '../../lib/stores/audit-filters-store'
// import { columns } from '../../columns'
// import { DataTable } from '@/modules/common/components/table/data-table'
// import { Popover, PopoverContent, PopoverTrigger } from '@/modules/common/components/popover/popover'
// import { Button } from '@/modules/common/components/button'
// import { CaretSortIcon } from '@radix-ui/react-icons'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/modules/common/components/command/command'
// import { CheckIcon } from 'lucide-react'
// import { cn } from '@/utils/utils'

// export type AuditWithUser = Prisma.AuditoriaGetPayload<{
//   include: {
//     usuario: true
//   }
// }>

// type AuditTableProps = {
//   logs: AuditWithUser[]
//   isInput?: boolean
// }

// const AttendanceTable: React.FC<AuditTableProps> = ({ logs, isInput }) => {
//   const store = useStore(useAllAuditFilterStore, (state) => state)

//   if (!store?.currentMonth) return <div>No hay mes seleccionado</div>
//   const currentMonth = new Date(store?.currentMonth)

//   const filteredLogs =
//     logs &&
//     logs.filter((log) => {
//       const fullName = `${log.usuario.tipo_cedula}-${log.usuario.cedula} ${log.usuario.nombre}`
//       const isMatchingName = fullName
//         .toLowerCase()
//         .includes(store.searchText.toLowerCase())
//       const isnMatchingCed = log.usuario.cedula
//         .toLowerCase()
//         .includes(store.searchText.toLowerCase())

//       return isMatchingName || isnMatchingCed
//     })

//   return (
//     <div className="flex flex-col gap-8">
//          <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value
//             ? frameworks.find((framework) => framework.value === value)?.label
//             : "Select framework..."}
//           <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search framework..." className="h-9" />
//           <CommandEmpty>No framework found.</CommandEmpty>
//           <CommandGroup>
//             {frameworks.map((framework) => (
//               <CommandItem
//                 key={framework.value}
//                 value={framework.value}
//                 onSelect={(currentValue) => {
//                   setValue(currentValue === value ? "" : currentValue)
//                   setOpen(false)
//                 }}
//               >
//                 {framework.label}
//                 <CheckIcon
//                   className={cn(
//                     "ml-auto h-4 w-4",
//                     value === framework.value ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//       <DataTable columns={columns} data={filteredLogs} />
//     </div>
//   )
// }

// export default AttendanceTable
