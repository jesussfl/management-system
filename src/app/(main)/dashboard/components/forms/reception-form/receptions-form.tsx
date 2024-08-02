'use client'
import { useState, useTransition } from 'react'

import { columns } from './columns'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { Form, FormDescription } from '@/modules/common/components/form'

import { Loader2 } from 'lucide-react'
import { DataTable } from '@/modules/common/components/table/data-table'

import { useToast } from '@/modules/common/components/toast/use-toast'

import { DialogFooter } from '@/modules/common/components/dialog/dialog'

import { ItemsWithAllRelations } from '@/lib/actions/item'
import { ReceptionFormValues } from '../../../abastecimiento/recepciones/lib/types/types'
import { FormDateFields } from '@/modules/common/components/form-date-fields/form-date-fields'
import { Separator } from '@/modules/common/components/separator/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  ItemSelector,
  SelectedItemsContainer,
} from '@/modules/common/components/item-selector'
import { FormPeopleFields } from '@/modules/common/components/form-people-fields'
import { useItemSelector } from '@/lib/hooks/use-item-selector'
import { createReception, updateReception } from '@/lib/actions/reception'
import { SelectedItemCardProvider } from './card-context/card-context'
import { SelectedItemCard } from './selected-item-card'
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
  servicio: 'Abastecimiento' | 'Armamento'
}

export default function ReceptionsForm({
  renglonesData,
  defaultValues,
  professionals,
  receivers,
  id,
  servicio,
}: Props) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const form = useForm<ReceptionFormValues>({
    mode: 'onChange',
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<ReceptionFormValues>({
    control: form.control,
    name: `renglones`,
  })
  const { handleTableSelect, rowSelection, selectedRowsData, deleteItem } =
    useItemSelector({
      itemsData: renglonesData,
      defaultItems: defaultValues?.renglones,
      fields,
      remove,
      append,
      appendObject: {
        cantidad: 0,
        fabricante: null,
        precio: 0,
        codigo_solicitud: null,
        fecha_fabricacion: null,
        fecha_vencimiento: null,
        seriales: [],
        seriales_automaticos: false,
        observacion: null,
      },
    })
  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])
  const isEditing = defaultValues ? true : false
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
        createReception(data, servicio).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })

            res.fields.map((field) => {
              setItemsWithoutSerials((prev) => [...prev, field])
            })
            return
          }

          toast({
            title: 'Recepción creada',
            description: 'La recepción se ha creado correctamente',
            variant: 'success',
          })
          router.replace(`/dashboard/${servicio.toLowerCase()}/recepciones`)
        })
        return
      }

      updateReception(id, data, servicio).then((res) => {
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
        router.replace(`/dashboard/${servicio.toLowerCase()}/recepciones`)
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
            <FormPeopleFields
              receivers={receivers}
              professionals={professionals}
              config={{
                destinatario_label: 'Persona que entrega:',
                abastecedor_label: 'Profesional que recibe:',
                servicio,
              }}
            />
            <Separator />
            <FormDateFields
              isEditEnabled={isEditing}
              config={{
                dateName: 'fecha_recepcion',
                dateLabel: 'Fecha de recepción',
                dateDescription:
                  'Seleccione la fecha en la que se reciben los renglones',
              }}
            />
            <Separator />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han recibido
              </FormDescription>
              <ItemSelector disabled={isEditing}>
                <DataTable
                  columns={columns}
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
          <SelectedItemsContainer>
            {selectedRowsData.map((item, index) => {
              const isEmpty = itemsWithoutSerials.includes(item.id)
                ? 'Este renglón no tiene seriales asociados'
                : false

              return (
                <SelectedItemCardProvider
                  key={item.id}
                  itemData={item}
                  index={index}
                  removeCard={() => deleteItem(index)}
                  isError={isEmpty}
                  setItemsWithoutSerials={setItemsWithoutSerials}
                  isEditing={isEditing}
                  section={servicio}
                >
                  <SelectedItemCard />
                </SelectedItemCardProvider>
              )
            })}
          </SelectedItemsContainer>
        )}

        <DialogFooter className="fixed right-0 bottom-0 bg-white border-t border-border gap-4 items-center w-full p-4">
          {isEditing && (
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
