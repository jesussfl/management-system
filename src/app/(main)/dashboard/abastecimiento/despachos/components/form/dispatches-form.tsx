'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { columns } from './columns'
import { cn } from '@/utils/utils'
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { useRouter } from 'next/navigation'
import { Box, CheckIcon, Plus, Trash } from 'lucide-react'
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
import { Prisma, Despacho, Despachos_Renglones, Serial } from '@prisma/client'
import ModalForm from '@/modules/common/components/modal-form'
import { SerialsForm } from './serials-form'
import { createDispatch } from '@/app/(main)/dashboard/abastecimiento/despachos/lib/actions/dispatches'
import { getAllReceivers } from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/receivers'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { SerialsFormNew } from './serials-form-new'
import { Input } from '@/modules/common/components/input/input'
import { Switch } from '@/modules/common/components/switch/switch'
import Link from 'next/link'

type Detalles = Omit<
  Despachos_Renglones,
  'id_despacho' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}

type FormValues = Omit<
  Despacho,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  renglones: Detalles[]
}
interface Props {
  renglonesData: RenglonType[]
  defaultValues?: FormValues
  close?: () => void
}
// type FormValues = Omit<RecepcionType, 'id' | 'renglones.id_recepcion'>
type ComboboxData = {
  value: string
  label: string
}
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
  const [isPending, startTransition] = useTransition()

  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean
  }>({})
  const [receivers, setReceivers] = useState<ComboboxData[]>([])
  const [selectedData, setSelectedData] = useState<RenglonType[]>([])
  const [itemsWithoutSerials, setItemsWithoutSerials] = useState<number[]>([])

  useEffect(() => {
    startTransition(() => {
      getAllReceivers().then((data) => {
        const transformedData = data.map((receiver) => ({
          value: receiver.cedula,
          label: receiver.cedula + '-' + receiver.nombres,
        }))

        setReceivers(transformedData)
      })
    })
  }, [])

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
          cantidad: 0,
          manualSelection: false,
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
    if (data.renglones.length === 0) {
      toast({
        title: 'Faltan campos',
        description: 'No se puede crear una recepción sin renglones',
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
    createDispatch(data).then((res) => {
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
              name="cedula_destinatario"
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <FormItem className="flex flex-1 justify-between gap-4 items-center">
                  <FormLabel>Destinatario:</FormLabel>
                  <div className="w-[70%]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? receivers.find(
                                  (receiver) => receiver.value === field.value
                                )?.label
                              : 'Seleccionar destinatario'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar destinatario..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {receivers.map((receiver) => (
                              <CommandItem
                                value={receiver.label}
                                key={receiver.value}
                                onSelect={() => {
                                  form.setValue(
                                    'cedula_destinatario',
                                    receiver.value
                                  )
                                }}
                              >
                                {receiver.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    receiver.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormDescription>
                      Si no encuentras el destinatario que buscas, puedes
                      crearlo
                      <Link
                        href="/dashboard/abastecimiento/destinatarios/agregar"
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'text-sm h-[30px]'
                        )}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Destinatario
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
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
                  const receptions = item.recepciones.reduce(
                    (total, item) => total + item.cantidad,
                    0
                  )

                  const dispatchedSerials = item.despachos.reduce(
                    (total, item) => total + item.seriales.length,
                    0
                  )

                  const totalStock = receptions - dispatchedSerials
                  const isEmpty = totalStock === 0
                  const isError = itemsWithoutSerials.includes(item.id)
                  return (
                    <SelectedItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      deleteItem={deleteItem}
                      isEmpty={isEmpty ? 'Este renglon no tiene stock' : false}
                      isError={
                        isError ? 'Este renglon no tiene seriales' : false
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
  isError,
  setItemsWithoutSerials,
}: {
  item: RenglonType
  isEmpty?: string | boolean
  index: number
  deleteItem: (index: number) => void
  isError?: string | boolean
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const { watch, control } = useFormContext()
  const receptions = item.recepciones.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  const dispatchedSerials = item.despachos.reduce(
    (total, item) => total + item.seriales.length,
    0
  )

  const totalStock = receptions - dispatchedSerials
  const serialsLength = watch(`renglones.${index}.seriales`).length

  useEffect(() => {
    if (serialsLength > 0) {
      setItemsWithoutSerials((prev) => {
        return prev.filter((id) => id !== item.id)
      })
    }
  }, [serialsLength, setItemsWithoutSerials, item.id])

  return (
    <Card
      key={item.id}
      className={`flex flex-col gap-4 ${
        isEmpty || isError ? 'border-red-400' : ''
      }`}
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
      <CardContent className="flex flex-col flex-1 justify-start gap-4">
        <FormField
          control={control}
          name={`renglones.${index}.manualSelection`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Seleccionar seriales manualmente</FormLabel>
                <FormDescription>
                  Esta opcion te permitira seleccionar los seriales especificos
                  que deseas despachar
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!watch(`renglones.${index}.manualSelection`) ? (
          <FormField
            control={control}
            name={`renglones.${index}.cantidad`}
            rules={{
              required: 'La cantidad es requerida',

              max: {
                value: totalStock,
                message: 'La cantidad no puede ser mayor al stock disponible',
              },

              validate: (value) => {
                if (
                  !watch(`renglones.${index}.manualSelection`) &&
                  value === 0
                ) {
                  return 'La cantidad debe ser mayor a 0'
                }
              },
            }}
            render={({ field }) => (
              <FormItem className="items-center flex flex-1 justify-between gap-2">
                <FormLabel className="w-[12rem]">
                  Cantidad a despachar
                </FormLabel>
                <div className="flex-1 w-full">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription className="w-[12rem]">
                    Cantidad disponible: {totalStock}
                  </FormDescription>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        ) : (
          <>
            <ModalForm
              triggerName={`${
                watch(`renglones.${index}.seriales`).length > 0
                  ? 'Ver seriales'
                  : 'Seleccionar seriales'
              }  `}
              triggerVariant={`${
                watch(`renglones.${index}.seriales`).length > 0
                  ? 'outline'
                  : 'default'
              }`}
              closeWarning={false}
              className="max-h-[80vh]"
              disabled={isEmpty ? true : false}
            >
              <SerialsFormNew index={index} id={item.id} />
            </ModalForm>

            <FormDescription>
              Seriales seleccionados:{' '}
              {watch(`renglones.${index}.seriales`).length}
            </FormDescription>
          </>
        )}

        <FormDescription className={`${isEmpty ? 'text-red-500' : ''}`}>
          {isEmpty}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
