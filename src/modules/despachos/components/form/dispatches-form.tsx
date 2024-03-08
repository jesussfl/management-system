'use client'
import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/modules/common/components/input/input'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { Box, Trash } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { RenglonType } from '@/types/types'
import { Calendar } from '@/modules/common/components/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
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
  Prisma,
  Recepcion,
  Despacho,
  Recepciones_Renglones,
  Despachos_Renglones,
  Serial,
} from '@prisma/client'
import { createReception } from '@/lib/actions/receptions'
import ModalForm from '@/modules/common/components/modal-form'
import { Switch } from '@/modules/common/components/switch/switch'
import { SerialsForm } from './serials-form'
import { v4 } from 'uuid'
import { createDispatch } from '@/lib/actions/dispatches'

type SerialType = Omit<Serial, 'id' | 'id_recepcion'>
type DespachoType = Prisma.Despachos_RenglonesGetPayload<{
  include: { renglon: true }
}>
type Detalles = Omit<Despachos_Renglones, 'id_despacho' | 'id'> & {
  seriales: string[]
}

type DefaultValues = Omit<Despachos_Renglones, 'id_despacho' | 'id'> & {
  seriales: string[]
}
type FormValues = Omit<Despacho, 'id'> & {
  renglones: Detalles[]
}
interface Props {
  renglonesData: RenglonType[]
  defaultValues?: FormValues
  close?: () => void
}
// type FormValues = Omit<RecepcionType, 'id' | 'renglones.id_recepcion'>

export default function DispatchesForm({
  renglonesData,
  defaultValues,
  close,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `renglones`,
  })
  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean
  }>({})
  const [selectedData, setSelectedData] = useState<RenglonType[]>([])
  useEffect(() => {
    if (defaultValues) {
      const renglones = defaultValues.renglones
      // @ts-ignore
      const renglonesData = renglones.map((item) => item.renglon) //TODO: revisar el tipado
      const selections = renglones.reduce(
        (acc, item) => {
          acc[item.id_renglon] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )
      setSelectedItems(selections)
      setSelectedData(renglonesData)
    }
  }, [defaultValues])
  const handleTableSelect = useCallback(
    (lastSelectedRow: any) => {
      if (lastSelectedRow) {
        append({
          id_renglon: lastSelectedRow.id,
          seriales: [],
        })
        setSelectedData((prev) => {
          if (prev.find((item) => item.id === lastSelectedRow.id)) {
            const index = prev.findIndex(
              (item) => item.id === lastSelectedRow.id
            )
            remove(index)
            return prev.filter((item) => item.id !== lastSelectedRow.id)
          } else {
            return [...prev, lastSelectedRow]
          }
        })
      }
    },
    [append, remove]
  )

  const deleteItem = (index: number) => {
    setSelectedData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedItems }
        if (item.id === selectedData[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedItems(nuevoObjeto)
        }
        return item.id !== selectedData[index].id
      })
    })
    remove(index)
  }
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    data.renglones.map((item, index) => {
      if (item.seriales.length === 0) {
        setItemsWithoutSerials((prev) => [...prev, item.id_renglon])
        return
      }
    })
    if (itemsWithoutSerials.length > 0) {
      return
    }
    createDispatch(data).then((res) => {
      if (res?.error) {
        toast({
          title: 'Error',
          description: res?.error,
          variant: 'destructive',
        })

        res.fields?.map((field) => {
          setItemsWithoutSerials((prev) => [...prev, field])
        })

        return
      }
      toast({
        title: 'Despacho creado',
        description: 'Los despachos se han creado correctamente',
        variant: 'success',
      })
      router.replace('/dashboard/abastecimiento/despachos')
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
            <CardTitle>
              Complete la información solicitada para el despacho de los
              renglones
            </CardTitle>
            <CardDescription>
              Llene los campos solicitados para el despacho de los renglones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 pt-4">
            <FormField
              control={form.control}
              name="motivo"
              rules={{
                required: 'Este campo es necesario',
                minLength: {
                  value: 10,
                  message: 'Debe tener al menos 10 carácteres',
                },
                maxLength: {
                  value: 200,
                  message: 'Debe tener un máximo de 200 carácteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <div className="flex flex-col gap-1">
                    <FormLabel>Motivo</FormLabel>
                    <FormDescription>
                      Redacta el motivo por el cual se está despachando el
                      material, renglones, etc...
                    </FormDescription>
                  </div>
                  <FormControl>
                    <textarea
                      id="motivo"
                      rows={3}
                      className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-b border-base-300" />
            <FormField
              control={form.control}
              name={`fecha_despacho`}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormItem className="flex flex-row flex-1 items-center gap-5 ">
                  <div className="w-[20rem]">
                    <FormLabel>Fecha de despacho</FormLabel>
                    <FormDescription>
                      Selecciona la fecha en la que se despachan los materiales
                      o renglones{' '}
                    </FormDescription>
                  </div>
                  <div className="flex-1 w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="border-b border-base-300" />

            <div className="flex flex-1 flex-row gap-8 items-center justify-between">
              <FormDescription className="w-[20rem]">
                Selecciona los materiales o renglones que se han despachado
              </FormDescription>
              <ModalForm
                triggerName="Seleccionar renglones"
                closeWarning={false}
              >
                <div className="flex flex-col gap-4 p-8">
                  <CardTitle>Selecciona los renglones despachados</CardTitle>
                  <CardDescription>
                    Encuentra y elige los productos que se han despachado en el
                    CESERLODAI. Usa la búsqueda para agilizar el proceso.
                  </CardDescription>
                  <DataTable
                    columns={columns}
                    data={renglonesData}
                    onSelectedRowsChange={handleTableSelect}
                    isColumnFilterEnabled={false}
                    selectedData={selectedItems}
                    setSelectedData={setSelectedItems}
                  />
                </div>
              </ModalForm>
            </div>
          </CardContent>
        </Card>

        {selectedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Detalle la información de cada renglón seleccionado
              </CardTitle>
              <CardDescription>
                Es necesario que cada renglón contenga la información
                correspondiente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-8 pt-4">
              <div className="grid xl:grid-cols-2 gap-4">
                {selectedData.map((item, index) => {
                  const isEmpty = itemsWithoutSerials.includes(item.id)
                  return (
                    <SelectedItemCard
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
        <Button variant="default" type={'submit'}>
          Guardar despacho
        </Button>
      </form>
    </Form>
  )
}

export const SelectedItemCard = ({
  item,
  index,
  deleteItem,
  isEmpty,
  setItemsWithoutSerials,
}: {
  item: RenglonType
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const form = useFormContext()
  return (
    <Card
      key={item.id}
      className={`flex flex-col gap-4 ${isEmpty ? 'border-red-400' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Box className="h-6 w-6 " />
          <div>
            <CardTitle className="text-md font-medium text-foreground">
              {item.nombre}
            </CardTitle>
            <CardDescription>
              {`${item.descripcion} - ${item.unidad_empaque.nombre} - Peso: ${item.peso} (${item.unidad_empaque.abreviacion}) `}
            </CardDescription>
          </div>
        </div>

        <Trash
          onClick={() => deleteItem(index)}
          className="h-5 w-5 text-red-800 cursor-pointer"
        />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-end">
        <div
          onClick={() => {
            if (isEmpty) {
              setItemsWithoutSerials((prev) => {
                return prev.filter((id) => id !== item.id)
              })
            }
          }}
        >
          <ModalForm
            triggerName={`${
              form.watch(`renglones.${index}.seriales`).length > 0
                ? 'Ver seriales'
                : 'Seleccionar seriales'
            }  `}
            triggerVariant={`${
              form.watch(`renglones.${index}.seriales`).length > 0
                ? 'outline'
                : 'default'
            }`}
            closeWarning={false}
            className="max-h-[80vh]"
          >
            <SerialsForm
              index={index}
              id={item.id}
              quantity={form.watch(`renglones.${index}.cantidad`)}
            />
          </ModalForm>
        </div>
        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
