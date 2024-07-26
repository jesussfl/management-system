'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { Form, FormDescription } from '@/modules/common/components/form'

import { Loader2, Plus } from 'lucide-react'
import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  createReception,
  updateReception,
} from '@/app/(main)/dashboard/abastecimiento/recepciones/lib/actions/receptions'
import ModalForm from '@/modules/common/components/modal-form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { CardItemSelected } from './card-item-selected'
import Link from 'next/link'

import { ItemsWithAllRelations } from '../../../inventario/lib/actions/items'
import { ReceptionFormValues } from '../../lib/types/types'
import { RowSelectionState } from '@tanstack/react-table'
import { ReceptionPeopleFields } from './reception-people-fields'
import { ReceptionDateFields } from './reception-date-fields'
type ComboboxData = {
  value: string
  label: string
}
interface Props {
  renglonesData: ItemsWithAllRelations
  id?: number
  defaultValues?: ReceptionFormValues
  professionals: ComboboxData[]
  receivers: ComboboxData[]
}

export default function ReceptionsForm({
  renglonesData,
  defaultValues,
  professionals,
  receivers,
  id,
}: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const form = useForm<ReceptionFormValues>({
    mode: 'onChange',
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray<ReceptionFormValues>({
    control: form.control,
    name: `renglones`,
  })
  const [isPending, startTransition] = useTransition()

  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({})
  const [selectedRowsData, setSelectedRowsData] =
    useState<ItemsWithAllRelations>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toogleModal = () => setIsModalOpen(!isModalOpen)

  useEffect(() => {
    if (defaultValues) {
      const selectedItems = defaultValues.renglones.reduce(
        (acc, item) => {
          acc[item.id_renglon] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )
      const itemsData = renglonesData.filter((item) => selectedItems[item.id])
      setSelectedRows(selectedItems)
      setSelectedRowsData(itemsData)
    }
  }, [defaultValues, renglonesData])

  const handleTableSelect = useCallback(
    (selections: ItemsWithAllRelations) => {
      if (!selections) return

      // Obtener los IDs de los elementos seleccionados
      const selectionIds = selections.map((item) => item.id)

      // Iterar sobre los elementos actuales y eliminar los que no están en selections
      fields.forEach((field, index) => {
        if (selectionIds.length === 0) return

        if (!selectionIds.includes(field.id_renglon)) {
          remove(index)
        }
      })

      // Agregar los nuevos elementos de selections que no están en fields
      selections.forEach((item) => {
        const exists = fields.some((field) => field.id_renglon === item.id)
        if (!exists) {
          append({
            id_renglon: item.id,
            cantidad: 0,
            fabricante: null,
            precio: 0,
            codigo_solicitud: null,
            fecha_fabricacion: null,
            fecha_vencimiento: null,
            seriales: [],
            seriales_automaticos: false,
            observacion: null,
          })
        }
      })

      setSelectedRowsData(selections)
    },
    [append, remove, fields]
  )

  const deleteItem = (index: number) => {
    setSelectedRowsData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedRows }
        if (item.id === selectedRowsData[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedRows(nuevoObjeto)
        }
        return item.id !== selectedRowsData[index].id
      })
    })
    remove(index)
  }

  const onSubmit: SubmitHandler<ReceptionFormValues> = async (data) => {
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear una recepción sin renglones',
      })
      return
    }

    data.renglones.map((item) => {
      item.seriales.length === 0 &&
        setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
    })

    if (itemsWithoutSerials.length > 0) {
      return
    }

    startTransition(() => {
      if (!id) {
        createReception(data).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })

            //@ts-ignore
            res.fields?.map((field) => {
              setItemsWithoutSerials((prev) => [...prev, field])
            })
            return
          }

          toast({
            title: 'Recepción creada',
            description: 'La recepción se ha creado correctamente',
            variant: 'success',
          })
          router.replace('/dashboard/abastecimiento/recepciones')
        })
        return
      }

      updateReception(id, data).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Recepción actualizada',
          description: 'La recepción se ha actualizado correctamente',
          variant: 'success',
        })
        router.replace('/dashboard/abastecimiento/recepciones')
      })
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-10 mb-[8rem] "
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Complete la información solicitada para la recepción de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para la recepción de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <ReceptionPeopleFields
              receivers={receivers}
              professionals={professionals}
            />
            <div className="border-b border-base-300" />
            <ReceptionDateFields />
            <div className="border-b border-base-300" />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han recibido
              </FormDescription>
              <ModalForm
                triggerName="Seleccionar renglones"
                closeWarning={false}
                open={isModalOpen}
                customToogleModal={toogleModal}
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>Selecciona los renglones recibidos</CardTitle>
                  <CardDescription>
                    Encuentra y elige los productos que se han recibido en el
                    CESERLODAI. Usa la búsqueda para agilizar el proceso.
                  </CardDescription>
                  <CardDescription>
                    Si no encuentras el renglón que buscas, puedes crearlo
                    <Link
                      href="/dashboard/abastecimiento/inventario/renglon"
                      className={cn(
                        buttonVariants({ variant: 'secondary' }),
                        'mx-4'
                      )}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Renglón
                    </Link>
                  </CardDescription>
                  <DataTable
                    columns={columns}
                    data={renglonesData}
                    onSelectedRowsChange={handleTableSelect}
                    selectedData={selectedRows}
                    isStatusEnabled={false}
                    setSelectedData={setSelectedRows}
                  />
                  <Button
                    className="w-[200px] sticky bottom-8 left-8"
                    variant={'default'}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Listo
                  </Button>
                </div>
              </ModalForm>
            </div>
          </CardContent>
        </Card>

        {fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Detalle la información de cada renglón seleccionado
              </CardTitle>
              <CardDescription>
                Es necesario que cada renglón contenga la información
                correspondiente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-8 pt-4">
              <div className="grid xl:grid-cols-2 gap-4">
                {selectedRowsData.map((item, index) => {
                  const isEmpty = itemsWithoutSerials.includes(item.id)
                  return (
                    <CardItemSelected
                      key={item.id}
                      item={item}
                      index={index}
                      deleteItem={deleteItem}
                      isEmpty={
                        isEmpty
                          ? 'Este renglon no tiene seriales asociados'
                          : false
                      }
                      setItemsWithoutSerials={setItemsWithoutSerials}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="fixed right-0 bottom-0 bg-white border-t border-border gap-4 items-center w-full p-4">
          <Button
            className="w-[200px]"
            disabled={isPending}
            variant="default"
            type={'submit'}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
