'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Eye, Plus, Trash2, Wand2 } from 'lucide-react'
import { Input } from '@/modules/common/components/input/input'
import { Button } from '@/modules/common/components/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { useItemCardContext } from '@/lib/context/selected-item-card-context'
import ModalForm from '@/modules/common/components/modal-form'
import { NumericFormat } from 'react-number-format'
import { checkSerialExistanceByItemId } from '@/lib/actions/serials'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/modules/common/components/accordion'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { nanoid } from 'nanoid'

type NewSerial = {
  serial: string
  condicion: string
  peso_actual?: number
}

export function SerialsForm() {
  const {
    index: itemIndex,
    itemData,
    isPackageForLiquids,
  } = useItemCardContext()
  const {
    control,
    watch,
    setValue,
    getValues,
    formState,
    clearErrors,
    setError,
    ...form
  } = useFormContext()
  const { toast } = useToast()
  const [newSerial, setNewSerial] = useState<string>('')
  const [serialCondition, setSerialCondition] = useState<string>('Nuevo')
  const [currentWeight, setCurrentWeight] = useState<number | undefined>()
  const [serials, setSerials] = useState<NewSerial[]>([])
  const quantity = watch(`renglones.${itemIndex}.cantidad`) || 0

  useEffect(() => {
    const currentSerials = getValues(`renglones.${itemIndex}.seriales`) || []
    setSerials(currentSerials)
  }, [getValues, itemIndex])

  const saveSerial = async () => {
    if (serials.length >= quantity) {
      toast({
        title: 'Error',
        description: `No se pueden agregar más de ${quantity} seriales`,
        variant: 'destructive',
      })
      return
    }

    if (
      !newSerial ||
      !serialCondition ||
      (!currentWeight && isPackageForLiquids)
    ) {
      toast({
        title: 'Error',
        description: 'Por favor, rellene todos los campos',
        variant: 'destructive',
      })
      return
    }

    if (isPackageForLiquids && currentWeight && currentWeight > itemData.peso) {
      toast({
        title: 'Error',
        description: `El peso no puede ser mayor a ${itemData.peso} ${itemData.tipo_medida_unidad.toLowerCase()}`,
        variant: 'destructive',
      })
      return
    }

    if (serials.some((serial) => serial.serial === newSerial)) {
      toast({
        title: 'Error',
        description: 'Este serial ya ha sido agregado',
        variant: 'destructive',
      })
      return
    }

    const exists = await checkSerialExistanceByItemId({
      id: itemData.id,
      serial: newSerial,
    })

    if (exists) {
      toast({
        title: 'Error',
        description: 'Ya existe un renglón de este tipo con este serial',
        variant: 'destructive',
      })
      return
    }

    const newSerialObj: NewSerial = {
      serial: newSerial,
      condicion: serialCondition,
      ...(isPackageForLiquids && { peso_actual: currentWeight }),
    }

    const updatedSerials = [...serials, newSerialObj]
    setSerials(updatedSerials)
    setValue(`renglones.${itemIndex}.seriales`, updatedSerials)
    setNewSerial('')
    setCurrentWeight(undefined)
  }

  const removeSerial = (index: number) => {
    const updatedSerials = serials.filter((_, i) => i !== index)
    setSerials(updatedSerials)
    setValue(`renglones.${itemIndex}.seriales`, updatedSerials)
  }

  const generateRandomSerials = async () => {
    if (!serialCondition || (isPackageForLiquids && !currentWeight)) {
      toast({
        title: 'Error',
        description:
          'Por favor, seleccione una condición y un peso (si aplica)',
        variant: 'destructive',
      })
      return
    }

    if (isPackageForLiquids && currentWeight && currentWeight > itemData.peso) {
      toast({
        title: 'Error',
        description: `El peso no puede ser mayor a ${itemData.peso} ${itemData.tipo_medida_unidad.toLowerCase()}`,
        variant: 'destructive',
      })
      return
    }

    const remainingQuantity = quantity - serials.length
    if (remainingQuantity <= 0) {
      toast({
        title: 'Error',
        description: 'Ya se han agregado todos los seriales necesarios',
        variant: 'destructive',
      })
      return
    }

    const newSerials: NewSerial[] = []
    for (let i = 0; i < remainingQuantity; i++) {
      let newSerial: string
      let exists: boolean
      do {
        newSerial = nanoid(11)
        exists = await checkSerialExistanceByItemId({
          id: itemData.id,
          serial: newSerial,
        })
      } while (exists)

      newSerials.push({
        serial: newSerial,
        condicion: serialCondition,
        ...(isPackageForLiquids && { peso_actual: currentWeight }),
      })
    }

    const updatedSerials = [...serials, ...newSerials]
    setSerials(updatedSerials)
    setValue(`renglones.${itemIndex}.seriales`, updatedSerials)
  }

  return (
    <div className="flex flex-col gap-0 overflow-y-auto p-8">
      <CardHeader>
        <CardTitle>Seriales</CardTitle>
        <CardDescription>Ingresa los seriales de la recepción</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex w-full gap-8">
          <div className="flex w-[50%] flex-col justify-start gap-2">
            <FormField
              control={control}
              name={`renglones.${itemIndex}.seriales.serial`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Serial</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setNewSerial(e.target.value)
                      }}
                      value={newSerial}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`renglones.${itemIndex}.seriales.condicion`}
              rules={{ required: 'La condición es requerida' }}
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Condición</FormLabel>
                  <Select
                    onValueChange={setSerialCondition}
                    defaultValue={serialCondition}
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
            {isPackageForLiquids && (
              <FormField
                control={control}
                name={`renglones.${itemIndex}.seriales.peso_actual`}
                rules={{
                  required: 'Peso requerido',
                  validate: (value) =>
                    value <= itemData.peso ||
                    `El peso no puede ser mayor a ${itemData.peso} ${itemData.tipo_medida_unidad.toLowerCase()}`,
                }}
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <FormLabel>
                      {itemData.tipo_medida_unidad.toLowerCase()} actuales{' '}
                      {` (Máximo. ${itemData.peso})`}
                    </FormLabel>
                    <FormControl>
                      <NumericFormat
                        className="border-1 rounded-md border-border bg-background text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                        allowNegative={false}
                        thousandSeparator=""
                        suffix={` ${itemData.tipo_medida_unidad.toLowerCase()}`}
                        decimalScale={2}
                        value={currentWeight}
                        onValueChange={({ floatValue }) => {
                          setCurrentWeight(floatValue)
                          onChange(floatValue)
                          if (floatValue && floatValue > itemData.peso) {
                            setError(
                              `renglones.${itemIndex}.seriales.peso_actual`,
                              {
                                type: 'manual',
                                message: `El peso no puede ser mayor a ${itemData.peso} ${itemData.tipo_medida_unidad.toLowerCase()}`,
                              }
                            )
                          } else {
                            clearErrors(
                              `renglones.${itemIndex}.seriales.peso_actual`
                            )
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex w-full justify-center gap-2">
              <Button variant="outline" onClick={saveSerial}>
                <Plus className="mr-2 h-4 w-4" />
                Cargar serial
              </Button>
              <Button variant="outline" onClick={generateRandomSerials}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generar seriales
              </Button>
            </div>
          </div>
          <div className="w-[50%]">
            <Accordion type="single" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Seriales Cargados ({serials.length}/{quantity})
                </AccordionTrigger>
                <AccordionContent>
                  {serials.length > 0
                    ? serials.map((serial, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1"
                        >
                          <p>
                            {serial.serial} - {serial.condicion}
                            {serial.peso_actual
                              ? ` - ${serial.peso_actual}`
                              : ''}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSerial(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    : 'No hay seriales cargados'}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

export const SerialsFormTrigger = () => {
  const { watch, getValues, setValue } = useFormContext()
  const { index: itemIndex, isEditing } = useItemCardContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const quantity = watch(`renglones.${itemIndex}.cantidad`)
  const registeredSerials =
    watch(`renglones.${itemIndex}.seriales`)?.length || 0

  const toggleModal = () => {
    if (isModalOpen) {
      // When closing the modal, ensure the form values are up to date
      const currentSerials = getValues(`renglones.${itemIndex}.seriales`) || []
      setValue(`renglones.${itemIndex}.seriales`, currentSerials)
    }
    setIsModalOpen(!isModalOpen)
  }

  const triggerVariant = registeredSerials > 0 ? 'outline' : 'default'
  const triggerIcon =
    registeredSerials > 0 ? (
      <Eye className="h-4 w-4" />
    ) : (
      <Plus className="h-4 w-4" />
    )
  const triggerName =
    registeredSerials > 0 ? 'Ver Seriales' : 'Asociar Seriales'

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
            onClick={toggleModal}
          >
            Listo
          </Button>
        </>
      </ModalForm>
    </div>
  )
}
