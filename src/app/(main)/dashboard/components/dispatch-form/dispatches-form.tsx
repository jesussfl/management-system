'use client'
import { useState, useTransition } from 'react'

import { selectItemColumns } from './columns/select-item-columns'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Form, FormDescription } from '@/modules/common/components/form'

import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { CardItemDispatch } from './card-item-dispatch'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { DispatchFormValues } from '../../abastecimiento/despachos/lib/types/types'
import { ItemsWithAllRelations } from '../../abastecimiento/inventario/lib/actions/items'
import { FormPeopleFields } from '@/modules/common/components/form-people-fields'
import { Separator } from '@/modules/common/components/separator/separator'
import { ItemSelector } from '@/modules/common/components/item-selector'
import { useItemSelector } from '@/lib/hooks/use-item-selector'
import { createDispatch, updateDispatch } from '../../lib/actions/dispatch'
import { FormDateFields } from '@/modules/common/components/form-date-fields/form-date-fields'

type ComboboxData = {
  value: string
  label: string
}

interface Props {
  renglonesData: ItemsWithAllRelations
  defaultValues?: DispatchFormValues
  servicio: 'Abastecimiento' | 'Armamento'
  professionals: ComboboxData[]
  receivers: ComboboxData[]
  id?: number
}
export default function DispatchesForm({
  renglonesData,
  defaultValues,
  professionals,
  receivers,
  id,
  servicio,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const [isPending, startTransition] = useTransition()

  const form = useForm<DispatchFormValues>({
    mode: 'all',
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<DispatchFormValues>({
    control: form.control,
    name: `renglones`,
  })

  const { handleTableSelect, rowSelection, selectedRowsData, deleteItem } =
    useItemSelector({
      itemsData: renglonesData,
      defaultItems: defaultValues?.renglones,
      fields,
      append,
      remove,
      appendObject: {
        cantidad: 0,
        manualSelection: false,
        seriales: [],
        observacion: '',
      },
    })

  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])

  const onSubmit: SubmitHandler<DispatchFormValues> = async (data) => {
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear un despacho sin renglones',
      })
      return
    }

    data.renglones.map((item) => {
      item.seriales.length === 0 && item.manualSelection
        ? setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
        : null
    })

    if (itemsWithoutSerials.length > 0) {
      return
    }

    if (!id) {
      startTransition(() => {
        createDispatch(data, servicio).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })
            return
          }
          toast({
            title: 'Despacho creado',
            description: 'Los despachos se han creado correctamente',
            variant: 'success',
          })
          router.replace(`/dashboard/${servicio.toLowerCase()}/despachos`)
        })
      })

      return
    }

    startTransition(() => {
      updateDispatch(id, data, servicio).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Despacho actualizado',
          description: 'Los despachos se han actualizado correctamente',
          variant: 'success',
        })
        router.replace(`/dashboard/${servicio.toLowerCase()}/despachos`)
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
              Complete la información solicitada para el despacho de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para el despacho de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <FormPeopleFields
              receivers={receivers}
              professionals={professionals}
              config={{
                destinatario_label: 'Persona a quien se despacha:',
                abastecedor_label: 'Persona que abastece:',
                servicio,
              }}
            />
            <Separator />

            <FormDateFields
              isEditEnabled={isEditEnabled}
              config={{
                dateName: 'fecha_despacho',
                dateLabel: 'Fecha de despacho',
                dateDescription:
                  'Seleccione la fecha en la que se realiza el despacho',
              }}
            />
            <Separator />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han despachado
              </FormDescription>
              <ItemSelector disabled={isEditEnabled}>
                <DataTable
                  columns={selectItemColumns}
                  data={renglonesData}
                  defaultSelection={rowSelection}
                  onSelectedRowsChange={handleTableSelect}
                  isStatusEnabled={false}
                />
              </ItemSelector>
            </div>
          </CardContent>
        </Card>

        {selectedRowsData.length > 0 && (
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
              <div className="grid md:grid-cols-2 gap-4">
                {selectedRowsData.map((item, index) => {
                  // console.log('item', item, item.devoluciones, item.despachos)
                  const enabledReceptions = item.recepciones.filter(
                    (reception) =>
                      reception.recepcion.fecha_eliminacion === null
                  )
                  const receptions = enabledReceptions.reduce(
                    (total, item) => total + item.cantidad,
                    0
                  )

                  const enabledDispatches = item.despachos.filter(
                    (dispatch) => dispatch.despacho.fecha_eliminacion === null
                  )

                  const dispatchedSerials = enabledDispatches.reduce(
                    (total, item) => total + item.seriales.length,
                    0
                  )

                  const enabledReturns = item.devoluciones.filter(
                    (returnItem) =>
                      returnItem.devolucion.fecha_eliminacion === null
                  )
                  const returnedSerials = enabledReturns.reduce(
                    (total, item) => total + item.seriales.length,
                    0
                  )
                  const currentDispatch = item.despachos.find((item) => {
                    return item.id_despacho === id
                  })
                  const totalStock = isEditEnabled
                    ? receptions -
                      dispatchedSerials +
                      (currentDispatch?.seriales.length ?? 0) +
                      returnedSerials
                    : receptions - dispatchedSerials + returnedSerials
                  const isEmpty = totalStock <= 0
                  const isError = itemsWithoutSerials.includes(item.id)
                  return (
                    <CardItemDispatch
                      key={item.id}
                      item={item}
                      index={index}
                      totalStock={totalStock < 0 ? 0 : totalStock}
                      dispatchId={id}
                      deleteItem={deleteItem}
                      isEmpty={isEmpty ? 'Este renglon no tiene stock' : false}
                      isError={
                        isError ? 'Este renglon no tiene seriales' : false
                      }
                      setItemsWithoutSerials={setItemsWithoutSerials}
                      isEditEnabled={isEditEnabled}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
          {isEditEnabled && (
            <p className="text-sm text-foreground">
              Algunos campos están deshabilitados para la edición
            </p>
          )}
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
