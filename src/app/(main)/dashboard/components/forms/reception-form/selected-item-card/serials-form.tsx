'use client'
import { Input } from '@/modules/common/components/input/input'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Switch } from '@/modules/common/components/switch/switch'
import { nanoid } from 'nanoid'
import { useItemCardContext } from '@/lib/context/selected-item-card-context'
import ModalForm from '@/modules/common/components/modal-form'
import { useState } from 'react'
import { Eye, Plus } from 'lucide-react'
import { Button } from '@/modules/common/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { NumericFormat } from 'react-number-format'
export function SerialsForm() {
  const {
    index: itemIndex,
    itemData,
    isPackageForLiquids,
  } = useItemCardContext()
  const { control, watch, setValue, formState, clearErrors } = useFormContext()
  const quantity = watch(`renglones.${itemIndex}.cantidad`)
  const itemId = itemData.id
  const autoSerialsEnabled = watch(
    `renglones.${itemIndex}.seriales_automaticos`
  )
  return (
    <div className="flex flex-col gap-0 overflow-y-auto p-8">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle>Seriales</CardTitle>
        <CardDescription>Ingresa los seriales de la recepción</CardDescription>
        <FormField
          control={control}
          name={`renglones.${itemIndex}.seriales_automaticos`}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row items-center justify-center gap-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      if (formState.errors[field.name]) {
                        clearErrors(field.name)
                      }
                      if (!value) {
                        Array.from({ length: quantity }).forEach((_, index) => {
                          setValue(
                            `renglones.${itemIndex}.seriales.${index}`,
                            {}
                          )
                        })
                      }
                      field.onChange(value)
                    }}
                  />
                </FormControl>

                <FormLabel>Seriales automaticos</FormLabel>
              </FormItem>
            )
          }}
        />
      </CardHeader>
      {Array.from({ length: quantity }).map((_, index) => (
        <div
          key={`renglon-${itemIndex}-serial-${index}`}
          className="mb-4 flex flex-row gap-8"
        >
          <FormField
            control={control}
            name={`renglones.${itemIndex}.seriales.${index}`}
            rules={{ required: 'El serial es requerido' }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Serial #{index + 1}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      if (formState.errors[field.name]) {
                        clearErrors(field.name)
                      }
                      const { value } = e.target
                      const currentValue = field.value
                      setValue(
                        field.name,
                        {
                          ...currentValue,
                          serial: value,
                        },
                        {
                          shouldDirty: true,
                        }
                      )
                    }}
                    value={
                      field.value?.serial ||
                      (autoSerialsEnabled
                        ? setValue(
                            field.name,
                            {
                              serial: nanoid(11),
                              id_renglon: itemId,
                              condicion: null,
                            },
                            {
                              shouldDirty: true,
                            }
                          )
                        : '') ||
                      ''
                    }
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`renglones.${itemIndex}.seriales.${index}.condicion`}
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Condición</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || 'Nuevo'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Nuevo">Nuevo</SelectItem>
                    <SelectItem value="Usado como nuevo">Como nuevo</SelectItem>
                    <SelectItem value="Bastante usado">
                      Bastante usado
                    </SelectItem>
                    <SelectItem value="Antiguo">antiguo</SelectItem>
                    <SelectItem value="Dañado sin reparación">
                      Dañado sin reparación
                    </SelectItem>
                    <SelectItem value="Dañado con reparación">
                      Dañado con reparación
                    </SelectItem>
                    <SelectItem value="Restaurado">Restaurado</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          {isPackageForLiquids && (
            <FormField
              control={control}
              name={`renglones.${itemIndex}.seriales.${index}.peso_actual`}
              rules={{
                required: 'Peso requerido',
                max: {
                  value: itemData.peso,
                  message: `Maximo ${
                    itemData.peso
                  } ${itemData.tipo_medida_unidad.toLowerCase()}`,
                },
              }}
              render={({ field: { value, onChange, ref, ...field } }) => {
                return (
                  <FormItem className="flex flex-col gap-1.5">
                    <FormLabel>
                      {itemData.tipo_medida_unidad.toLowerCase()} actuales{' '}
                      {` (Máximo. ${itemData.peso})`}{' '}
                    </FormLabel>

                    <FormControl>
                      <NumericFormat
                        className="border-1 rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                        allowNegative={false}
                        thousandSeparator=""
                        suffix={` ${itemData.tipo_medida_unidad.toLowerCase()}`}
                        decimalScale={2}
                        getInputRef={ref}
                        value={value}
                        onValueChange={({ floatValue }) => {
                          onChange(floatValue || '')
                          clearErrors(field.name)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export const SerialsFormTrigger = () => {
  const { watch, trigger } = useFormContext()
  const { toast } = useToast()
  const {
    itemData,
    isError,
    setItemsWithoutSerials,
    index: itemIndex,
    isEditing,
    isPackageForLiquids,
  } = useItemCardContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const registeredSerials: number =
    watch(`renglones.${itemIndex}.seriales`)?.length || 0
  const quantity = watch(`renglones.${itemIndex}.cantidad`)
  const triggerVariant = registeredSerials > 0 ? 'outline' : 'default'
  const triggerIcon =
    registeredSerials > 0 ? (
      <Eye className="h-4 w-4" />
    ) : (
      <Plus className="h-4 w-4" />
    )
  const triggerName =
    registeredSerials > 0 ? 'Ver Seriales' : 'Asociar Seriales'

  const toogleModal = () => setIsModalOpen(!isModalOpen)
  return (
    <div className="mt-4">
      <ModalForm
        triggerName={triggerName}
        triggerVariant={triggerVariant}
        triggerIcon={triggerIcon}
        closeWarning={false}
        className="max-h-[80vh]"
        disabled={!quantity || isEditing}
        open={isModalOpen}
        customToogleModal={toogleModal}
      >
        <>
          <SerialsForm />
          <Button
            className="sticky bottom-8 left-8 w-[200px]"
            variant={'default'}
            onClick={() => {
              if (isError && setItemsWithoutSerials) {
                setItemsWithoutSerials((prev) => {
                  return prev.filter((id) => id !== itemData.id)
                })

                return
              }
              const serials = watch(`renglones.${itemIndex}.seriales`)
              const isSomeFieldEmpty = serials.some(
                (selectedSerial: any, index: number) => {
                  if (
                    !selectedSerial.serial ||
                    !selectedSerial.condicion ||
                    (!selectedSerial.peso_actual && isPackageForLiquids)
                  ) {
                    if (!selectedSerial.condicion) {
                      trigger(
                        `renglones.${itemIndex}.seriales.${index}.condicion`
                      )
                    }

                    if (!selectedSerial.peso_actual) {
                      trigger(
                        `renglones.${itemIndex}.seriales.${index}.peso_actual`
                      )
                    }
                    trigger(`renglones.${itemIndex}.seriales.${index}.serial`)

                    return true
                  }

                  return false
                }
              )

              if (isSomeFieldEmpty) {
                toast({
                  title:
                    'Hay campos vacios o incorrectos, por favor revisa los datos',
                  variant: 'destructive',
                })
                return
              }
              toogleModal()
            }}
          >
            Listo
          </Button>
        </>
      </ModalForm>
    </div>
  )
}
