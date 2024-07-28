'use client'
import { useState } from 'react'

import { columns } from './columns'
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
import { createReturn, updateReturn } from '../../lib/actions/return'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { ItemsWithAllRelations } from '../../abastecimiento/inventario/lib/actions/items'
import { ReturnFormValues } from '../../abastecimiento/devoluciones/lib/types/types'
import { FormPeopleFields } from '@/modules/common/components/form-people-fields'
import { useItemSelector } from '@/lib/hooks/use-item-selector'
import { ItemSelector } from '@/modules/common/components/item-selector'
import { Separator } from '@/modules/common/components/separator/separator'
import { FormDateFields } from '@/modules/common/components/form-date-fields/form-date-fields'

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
        className=" space-y-10 mb-[8rem] "
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
              config={{
                dateName: 'fecha_devolucion',
                dateLabel: 'Fecha de devolució́n',
                dateDescription:
                  'Selecciona la fecha en la que se devuelven los renglones',
              }}
            />
            <Separator />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han devuelto
              </FormDescription>
              <ItemSelector>
                <DataTable
                  columns={columns}
                  data={renglonesData.filter((item) => {
                    if (item.despachos.length > 0) {
                      return true
                    }

                    return false
                  })}
                  onSelectedRowsChange={handleTableSelect}
                  defaultSelection={rowSelection}
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
                  const isError = itemsWithoutSerials.includes(item.id)
                  return (
                    <SelectedItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      deleteItem={deleteItem}
                      isError={
                        isError ? 'Este renglon no tiene seriales' : false
                      }
                      isEditEnabled={isEditEnabled}
                      returnId={id}
                      setItemsWithoutSerials={setItemsWithoutSerials}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
        <Button variant="default" type={'submit'}>
          Guardar Devolución
        </Button>
      </form>
    </Form>
  )
}
