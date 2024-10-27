'use client'
import { useState, useTransition } from 'react'

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

import { CardItemLoan } from './card-item-loan'

import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { ItemsWithAllRelations } from '@/lib/actions/item'
import { FormPeopleFields } from '@/modules/common/components/form-people-fields'
import { Separator } from '@/modules/common/components/separator/separator'
import { ItemSelector } from '@/modules/common/components/item-selector'
import { useItemSelector } from '@/lib/hooks/use-item-selector'
import { createLoan, updateLoan } from '@/lib/actions/loan'
import { FormDateFields } from '@/modules/common/components/form-date-fields/form-date-fields'
import { SelectedItemCardProvider } from '@/lib/context/selected-item-card-context'
import { itemSelectorColumns } from '../../columns/item-selector-columns'
import { LoanFormValues } from '@/lib/types/loan-types'

type ComboboxData = {
  value: string
  label: string
}

interface Props {
  renglonesData: ItemsWithAllRelations
  defaultValues?: LoanFormValues
  servicio: 'Abastecimiento' | 'Armamento'
  professionals: ComboboxData[]
  receivers: ComboboxData[]
  id?: number
}
export default function LoanesForm({
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

  const form = useForm<LoanFormValues>({
    mode: 'all',
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<LoanFormValues>({
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

  const onSubmit: SubmitHandler<LoanFormValues> = async (data) => {
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear un prestamo sin renglones',
      })
      return
    }

    if (!id) {
      startTransition(() => {
        createLoan(data, servicio).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })
            return
          }
          toast({
            title: 'Prestamo creado',
            description: 'Los prestamos se han creado correctamente',
            variant: 'success',
          })
          router.replace(`/dashboard/${servicio.toLowerCase()}/prestamos`)
        })
      })

      return
    }

    startTransition(() => {
      updateLoan(id, data, servicio).then((res) => {
        if (res?.error) {
          toast({
            title: 'Error',
            description: res?.error,
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Prestamo actualizado',
          description: 'Los prestamos se han actualizado correctamente',
          variant: 'success',
        })
        router.replace(`/dashboard/${servicio.toLowerCase()}/prestamos`)
      })
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
              Complete la información solicitada para el prestamo de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para el prestamo de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <FormPeopleFields
              receivers={receivers}
              professionals={professionals}
              config={{
                destinatario_label: 'Persona a quien se presta:',
                abastecedor_label: 'Persona que abastece:',
                servicio,
              }}
            />
            <Separator />

            <FormDateFields
              isEditEnabled={isEditEnabled}
              config={{
                dateName: 'fecha_prestamo',
                dateLabel: 'Fecha de prestamo',
                dateDescription:
                  'Seleccione la fecha en la que se realiza el prestamo',
              }}
            />
            <Separator />

            <div className="flex flex-1 flex-row items-center justify-between gap-8">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han despachado
              </FormDescription>
              <ItemSelector disabled={isEditEnabled}>
                <DataTable
                  columns={itemSelectorColumns}
                  data={renglonesData}
                  defaultSelection={rowSelection}
                  onSelectedRowsChange={handleTableSelect}
                  isStatusEnabled={false}
                />
              </ItemSelector>
            </div>
          </CardContent>
        </Card>

        {fields.length > 0 && isEditEnabled && (
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

                  const isEmpty = item.stock_actual <= 0

                  return (
                    <SelectedItemCardProvider
                      key={item.id}
                      itemData={item}
                      index={index}
                      removeCard={() => deleteItem(index, item.id)}
                      isError={isEmpty}
                      isEditing={isEditEnabled}
                      section={servicio}
                    >
                      <CardItemLoan />
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
