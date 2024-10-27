'use client'
import { useState, useTransition } from 'react'

import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
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
import { SelectedItemCard } from './card-item-selected'
import { createReturn, updateReturn } from '@/lib/actions/return'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { ItemsWithAllRelations } from '@/lib/actions/item'
import { ReturnFormValues } from '@/lib/types/return-types'
import { FormPeopleFields } from '@/modules/common/components/form-people-fields'
import { useItemSelector } from '@/lib/hooks/use-item-selector'
import { ItemSelector } from '@/modules/common/components/item-selector'
import { Separator } from '@/modules/common/components/separator/separator'
import { FormDateFields } from '@/modules/common/components/form-date-fields/form-date-fields'
import { Loader2 } from 'lucide-react'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { SelectedItemCardProvider } from '@/lib/context/selected-item-card-context'
import { itemSelectorColumns } from '../../columns/item-selector-columns'

type ComboboxData = {
  value: string
  label: string
}
interface Props {
  renglonesData: ItemsWithAllRelations
  defaultValues?: ReturnFormValues
  receivers: ComboboxData[]
  professionals: ComboboxData[]
  servicio: 'Abastecimiento' | 'Armamento'
  id?: number
}

export default function ReturnsForm({
  renglonesData,
  defaultValues,
  receivers,
  professionals,
  id,
  servicio,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const [isPending, startTransition] = useTransition()

  const form = useForm<ReturnFormValues>({
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<ReturnFormValues>({
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
        seriales: [],
        observacion: '',
      },
    })
  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])

  const onSubmit: SubmitHandler<ReturnFormValues> = async (data) => {
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear una recepción sin renglones',
      })
      return
    }

    data.renglones.map((item) => {
      item.seriales.length === 0
        ? setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
        : null
    })

    if (itemsWithoutSerials.length > 0) {
      return
    }
    if (!id) {
      createReturn(data, servicio).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Devolución creada',
          description: 'Las devoluciones se han creado correctamente',
          variant: 'success',
        })
        router.replace(`/dashboard/${servicio.toLowerCase()}/devoluciones`)
      })

      return
    }

    updateReturn(id, data, servicio).then((res) => {
      if (res?.error) {
        toast({
          title: 'Error',
          description: res?.error,
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Devolución actualizada',
        description: 'Las devoluciones se han actualizado correctamente',
        variant: 'success',
      })
      router.replace(`/dashboard/${servicio.toLowerCase()}/devoluciones`)
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-[8rem] space-y-10"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Complete la información solicitada para la devolución de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para la devolución de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <FormPeopleFields
              receivers={receivers}
              professionals={professionals}
              config={{
                destinatario_label: 'Persona que devuelve:',
                abastecedor_label: 'Persona que recibe:',
                servicio,
              }}
            />

            <Separator />

            <FormDateFields
              isEditEnabled={isEditEnabled}
              config={{
                dateName: 'fecha_devolucion',
                dateLabel: 'Fecha de devolució́n',
                dateDescription:
                  'Selecciona la fecha en la que se devuelven los renglones',
              }}
            />
            <Separator />

            <div className="flex flex-1 flex-row items-center justify-between gap-8">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han devuelto
              </FormDescription>
              <ItemSelector disabled={isEditEnabled}>
                <DataTable
                  columns={itemSelectorColumns}
                  data={renglonesData}
                  onSelectedRowsChange={handleTableSelect}
                  defaultSelection={rowSelection}
                  isStatusEnabled={false}
                />
              </ItemSelector>
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
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field, index) => {
                  const item = selectedRowsData.find(
                    (item) => item.id === field.id_renglon
                  )

                  if (!item) {
                    return null
                  }

                  const isError = itemsWithoutSerials.includes(item.id)
                  return (
                    <SelectedItemCardProvider
                      key={item.id}
                      section={servicio}
                      isEditing={isEditEnabled}
                      removeCard={() => deleteItem(index, item.id)}
                      itemData={item}
                      isError={isError}
                      index={index}
                      setItemsWithoutSerials={setItemsWithoutSerials}
                    >
                      <SelectedItemCard />
                    </SelectedItemCardProvider>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
        <DialogFooter className="fixed bottom-0 right-0 w-full items-center gap-4 border-t border-border bg-white p-4 pt-4">
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
