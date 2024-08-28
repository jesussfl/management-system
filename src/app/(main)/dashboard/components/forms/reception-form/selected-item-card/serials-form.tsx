'use client'
import { Input } from '@/modules/common/components/input/input'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import {
  CardContent,
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

  const conditionsPerSerial = !watch(
    `renglones.${itemIndex}.condicion_automatica`
  )
  const [generalCondition, setGeneralCondition] = useState<string>('')

  return (
    <div className="flex flex-col gap-0 overflow-y-auto p-8">
      <CardHeader>
        <CardTitle>Seriales</CardTitle>
        <CardDescription>Ingresa los seriales de la recepción</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <FormField
          control={control}
          name={`renglones.${itemIndex}.seriales_automaticos`}
          render={({ field }) => {
            return (
              <FormItem className="flex w-[50%] flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Rellenar seriales automaticamente</FormLabel>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      if (value) {
                        Array.from({ length: quantity }).forEach((_, index) => {
                          setValue(
                            `renglones.${itemIndex}.seriales.${index}.serial`,
                            nanoid(11)
                          )
                        })
                      }
                      field.onChange(value)
                    }}
                  />
                </FormControl>
              </FormItem>
            )
          }}
        />
        <FormField
          control={control}
          name={`renglones.${itemIndex}.condicion_automatica`}
          render={({ field }) => {
            return (
              <FormItem className="flex w-[50%] flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
                <FormLabel>
                  Agregar misma condición para todos los seriales{' '}
                </FormLabel>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      setGeneralCondition('')
                      Array.from({ length: quantity }).forEach((_, index) => {
                        setValue(
                          `renglones.${itemIndex}.seriales.${index}.condicion`,
                          ''
                        )
                      })
                      field.onChange(value)
                    }}
                  />
                </FormControl>
              </FormItem>
            )
          }}
        />
        {!conditionsPerSerial && (
          <div className="flex w-[50%] flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
            <FormLabel>Selecciona la condición</FormLabel>
            <Select
              onValueChange={(value) => {
                Array.from({ length: quantity }).forEach((_, index) => {
                  setValue(
                    `renglones.${itemIndex}.seriales.${index}.condicion`,
                    value
                  )
                })

                setGeneralCondition(value)
              }}
              defaultValue={generalCondition}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="flex-1">
                <SelectItem value="Nuevo">Nuevo</SelectItem>
                <SelectItem value="Usado Como nuevo">
                  Usado como nuevo
                </SelectItem>
                <SelectItem value="Bastante usado">Bastante usado</SelectItem>
                <SelectItem value="Antiguo">Antiguo</SelectItem>
                <SelectItem value="Dañado sin reparación">
                  Dañado sin reparación
                </SelectItem>
                <SelectItem value="Dañado con reparación">
                  Dañado con reparación
                </SelectItem>
                <SelectItem value="Restaurado">Restaurado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {Array.from({ length: quantity }).map((_, index) => (
          <div
            key={`renglon-${itemIndex}-serial-${index}`}
            className="mb-4 flex flex-row gap-8"
          >
            <FormField
              control={control}
              name={`renglones.${itemIndex}.seriales.${index}.serial`}
              rules={{
                required: 'El serial es requerido',
                validate: (value) => {
                  const serials = watch(`renglones.${itemIndex}.seriales`)
                    .map((serial: any) => serial.serial)
                    .filter((serial: any) => serial === value)

                  if (serials.length > 1) {
                    return 'No puedes tener dos o más seriales iguales'
                  }

                  return true
                },
              }}
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

                        field.onChange(e)
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {conditionsPerSerial && (
              <FormField
                control={control}
                name={`renglones.${itemIndex}.seriales.${index}.condicion`}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Condición</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nuevo">Nuevo</SelectItem>
                        <SelectItem value="Usado Como nuevo">
                          Usado como nuevo
                        </SelectItem>
                        <SelectItem value="Bastante usado">
                          Bastante usado
                        </SelectItem>
                        <SelectItem value="Antiguo">Antiguo</SelectItem>
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
            )}

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
      </CardContent>
    </div>
  )
}

export const SerialsFormTrigger = () => {
  const { watch, trigger, formState } = useFormContext()
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
  const triggerVariant = getTriggerVariant(registeredSerials)
  const triggerIcon = getTriggerIcon(registeredSerials)
  const triggerName = getTriggerName(registeredSerials)

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  const handleButtonClick = () => {
    if (isError && setItemsWithoutSerials) {
      updateItemsWithoutSerials()
      return
    }

    if (validateSerials()) {
      toggleModal()
    }
  }

  const updateItemsWithoutSerials = () => {
    setItemsWithoutSerials &&
      setItemsWithoutSerials((prev) => prev.filter((id) => id !== itemData.id))
  }

  const validateSerials = () => {
    const serials = watch(`renglones.${itemIndex}.seriales`)
    const isSomeFieldEmpty = serials.some(
      (selectedSerial: any, index: number) =>
        checkSerialFields(selectedSerial, index)
    )

    if (isSomeFieldEmpty) {
      toast({
        title: 'Hay campos vacios o incorrectos, por favor revisa los datos',
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const checkSerialFields = (serial: any, index: number) => {
    const itemErrors = formState.errors[`renglones`] as any
    const serialErrors = itemErrors?.[itemIndex]?.seriales || []

    if (serialErrors.length > 0) {
      toast({
        title: 'Hay campos con errores, por favor revisa los datos',
        variant: 'destructive',
      })
      return true
    }

    if (isFieldEmpty(serial)) {
      triggerFields(serial, index)
      return true
    }

    return false
  }

  const isFieldEmpty = (serial: any) => {
    return (
      !serial.serial ||
      !serial.condicion ||
      (!serial.peso_actual && isPackageForLiquids)
    )
  }

  const triggerFields = (serial: any, index: number) => {
    if (!serial.condicion) {
      trigger(`renglones.${itemIndex}.seriales.${index}.condicion`)
    }
    if (!serial.peso_actual && isPackageForLiquids) {
      trigger(`renglones.${itemIndex}.seriales.${index}.peso_actual`)
    }
    trigger(`renglones.${itemIndex}.seriales.${index}.serial`)
  }

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
        customToogleModal={toggleModal}
      >
        <>
          <SerialsForm />
          <Button
            className="sticky bottom-8 left-8 w-[200px]"
            variant="default"
            onClick={handleButtonClick}
          >
            Listo
          </Button>
        </>
      </ModalForm>
    </div>
  )
}

const getTriggerVariant = (registeredSerials: number) =>
  registeredSerials > 0 ? 'outline' : 'default'

const getTriggerIcon = (registeredSerials: number) =>
  registeredSerials > 0 ? (
    <Eye className="h-4 w-4" />
  ) : (
    <Plus className="h-4 w-4" />
  )

const getTriggerName = (registeredSerials: number) =>
  registeredSerials > 0 ? 'Ver Seriales' : 'Asociar Seriales'
