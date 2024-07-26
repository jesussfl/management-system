// 'use client'

// import { Button, buttonVariants } from '@/modules/common/components/button'
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/modules/common/components/form'

// import { Plus, TrashIcon } from 'lucide-react'
// import {
//   CardDescription,
//   CardTitle,
// } from '@/modules/common/components/card/card'
// import ModalForm from '@/modules/common/components/modal-form'
// import DatePicker, { registerLocale } from 'react-datepicker'
// import es from 'date-fns/locale/es'
// registerLocale('es', es)
// import 'react-datepicker/dist/react-datepicker.css'
// import { startOfDay } from 'date-fns'
// import { Input } from '@/modules/common/components/input/input'
// import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
// import { useFormContext } from 'react-hook-form'
// import { useCallback, useEffect, useState } from 'react'
// import { useToast } from '@/modules/common/components/toast/use-toast'
// import Link from 'next/link'
// import { cn } from '@/utils/utils'
// import { DataTable } from '@/modules/common/components/table/data-table'
// import { columns } from './columns'
// import { ItemsWithAllRelations } from '../../../inventario/lib/actions/items'
// import { RowSelectionState } from '@tanstack/react-table'

// interface Props {
//   renglonesData: ItemsWithAllRelations

// }
// export const ItemSelector = ({ renglonesData }: Props) => {
//   const form = useFormContext()

//   const renglones = form.getValues('')
//   const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])
//   const [selectedRows, setSelectedRows] = useState<RowSelectionState>({})
//   const [selectedRowsData, setSelectedRowsData] =
//     useState<ItemsWithAllRelations>([])

//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const toogleModal = () => setIsModalOpen(!isModalOpen)

//   const handleTableSelect = useCallback(
//     (selections: ItemsWithAllRelations) => {
//       if (!selections) return

//       // Obtener los IDs de los elementos seleccionados
//       const selectionIds = selections.map((item) => item.id)

//       // Iterar sobre los elementos actuales y eliminar los que no están en selections
//       fields.forEach((field, index) => {
//         if (selectionIds.length === 0) return

//         if (!selectionIds.includes(field.id_renglon)) {
//           remove(index)
//         }
//       })

//       // Agregar los nuevos elementos de selections que no están en fields
//       selections.forEach((item) => {
//         const exists = fields.some((field) => field.id_renglon === item.id)
//         if (!exists) {
//           append({
//             id_renglon: item.id,
//             cantidad: 0,
//             fabricante: null,
//             precio: 0,
//             codigo_solicitud: null,
//             fecha_fabricacion: null,
//             fecha_vencimiento: null,
//             seriales: [],
//             seriales_automaticos: false,
//             observacion: null,
//           })
//         }
//       })

//       setSelectedRowsData(selections)
//     },
//     [append, remove, fields]
//   )

//   return (
//     <div className="flex flex-1 flex-row gap-8 items-center justify-between">

//       <FormDescription className="w-[20rem]">
//         Selecciona los materiales o renglones que se han recibido
//       </FormDescription>
//       <ModalForm
//         triggerName="Seleccionar renglones"
//         closeWarning={false}
//         open={isModalOpen}
//         customToogleModal={toogleModal}
//       >
//         <div className="flex flex-col gap-4 p-8">
//           <CardTitle>Selecciona los renglones recibidos</CardTitle>
//           <CardDescription>
//             Encuentra y elige los productos que se han recibido en el
//             CESERLODAI. Usa la búsqueda para agilizar el proceso.
//           </CardDescription>
//           <CardDescription>
//             Si no encuentras el renglón que buscas, puedes crearlo
//             <Link
//               href="/dashboard/abastecimiento/inventario/renglon"
//               className={cn(buttonVariants({ variant: 'secondary' }), 'mx-4')}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Crear Renglón
//             </Link>
//           </CardDescription>
//           <DataTable
//             columns={columns}
//             data={renglonesData}
//             onSelectedRowsChange={handleTableSelect}
//             selectedData={selectedRows}
//             isStatusEnabled={false}
//             setSelectedData={setSelectedRows}
//           />
//           <Button
//             className="w-[200px] sticky bottom-8 left-8"
//             variant={'default'}
//             onClick={() => setIsModalOpen(false)}
//           >
//             Listo
//           </Button>
//         </div>
//       </ModalForm>
//       </div>

//   )
// }
