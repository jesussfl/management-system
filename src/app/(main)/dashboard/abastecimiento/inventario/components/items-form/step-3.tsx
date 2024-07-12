import { useFormContext } from 'react-hook-form'
import {
  FormInstructions,
  FormInstructionsDescription,
  FormInstructionsTitle,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'
import useGetWeight from '../../lib/hooks/useGetWeight'
import { useEffect, useState } from 'react'
import { getAllSubsystems } from '../../lib/actions/subsystems'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { cn } from '@/utils/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { ComboboxData } from '@/types/types'
import { CheckIcon, Loader2 } from 'lucide-react'
import { Switch } from '@/modules/common/components/switch/switch'
import { getAllWarehouses } from '../../../../almacenes/lib/actions/warehouse'
import Link from 'next/link'
import ImageUpload from '@/modules/common/components/file-upload'
import Image from 'next/image'
import { NumericFormat } from 'react-number-format'

export const Step3 = ({
  image,
  setImage,
}: {
  image: FormData | null
  setImage: (image: FormData | null) => void
}) => {
  const { control, watch, setValue, getValues } = useFormContext()
  const { weight } = useGetWeight()
  const [subsystems, setSubsystems] = useState<ComboboxData[]>([])
  const [warehouses, setWarehouses] = useState<ComboboxData[]>([])
  const [hasSubsystem, setHasSubsystem] = useState(false)
  const [isSubsystemLoading, setIsSubsystemLoading] = useState(false)
  const [isWarehouseLoading, setIsWarehouseLoading] = useState(false)
  useEffect(() => {
    setIsSubsystemLoading(true)
    setIsWarehouseLoading(true)
    getAllSubsystems().then((data) => {
      const transformedData = data.map((subsystem) => ({
        value: subsystem.id,
        label: `${subsystem.nombre} - ${subsystem.sistema.nombre}`,
      }))

      setSubsystems(transformedData)
    })
    getAllWarehouses().then((data) => {
      const transformedData = data.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.nombre,
      }))
      setWarehouses(transformedData)
    })
    setIsWarehouseLoading(false)
    setIsSubsystemLoading(false)
  }, [])

  const subsystemId = watch('id_subsistema')

  // useEffect(() => {
  //   setValue('peso', weight)
  // }, [weight, setValue])
  console.log(watch('peso'), 'pesooo')
  useEffect(() => {
    setHasSubsystem(!!subsystemId)
  }, [subsystemId])

  return (
    <div className="flex flex-col gap-8 mb-8">
      <FormInstructions>
        <FormInstructionsTitle>
          Solo faltan algunos detalles adicionales
        </FormInstructionsTitle>
        <FormInstructionsDescription>
          Añade detalles específicos adicionales para enriquecer la información
          y mejorar la experiencia en la gestión del inventario
        </FormInstructionsDescription>
      </FormInstructions>
      <FormField
        control={control}
        name="id_almacen"
        rules={{ required: 'Este campo es requerido' }}
        render={({ field }) => (
          <FormItem className="flex flex-1 justify-between gap-4 items-center">
            <FormLabel>En qué almacen se encuentra:</FormLabel>
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
                        ? warehouses.find(
                            (warehouse) => warehouse.value === field.value
                          )?.label
                        : 'Seleccionar almacén...'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="PopoverContent">
                  <Command>
                    <CommandInput
                      placeholder="Buscar almacén..."
                      className="h-9"
                    />
                    <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                    <CommandGroup>
                      {isWarehouseLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        warehouses.map((warehouse) => (
                          <CommandItem
                            value={warehouse.label}
                            key={warehouse.value}
                            onSelect={() => {
                              setValue('id_almacen', warehouse.value, {
                                shouldDirty: true,
                              })
                            }}
                          >
                            {warehouse.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                warehouse.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Si no encuentras el almacén, puedes crearlo
                <Link
                  href="/dashboard/almacenes/almacen"
                  className={cn(buttonVariants({ variant: 'link' }), 'h-[1px]')}
                >
                  Crear Almacén
                </Link>
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormLabel>¿Este renglón pertenece a un subsistema?</FormLabel>
      <div className="flex gap-4 items-center">
        <FormDescription>No</FormDescription>
        <Switch
          checked={hasSubsystem}
          onCheckedChange={(value) => {
            if (value) {
              setHasSubsystem(true)
            } else {
              setValue('id_subsistema', null, { shouldDirty: true })
              setHasSubsystem(false)
            }
          }}
        />
        <FormDescription>Si</FormDescription>
      </div>
      {hasSubsystem && (
        <>
          <FormField
            control={control}
            name="id_subsistema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subsistema:</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!hasSubsystem}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? subsystems.find(
                              (subsystem) => subsystem.value === field.value
                            )?.label
                          : 'Seleccionar subsistema'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="PopoverContent">
                    <Command>
                      <CommandInput
                        placeholder="Buscar subsistema..."
                        className="h-9"
                      />
                      <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                      <CommandGroup>
                        {isSubsystemLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          subsystems.map((subsystem) => (
                            <CommandItem
                              value={subsystem.label}
                              key={subsystem.value}
                              onSelect={() => {
                                setValue('id_subsistema', subsystem.value, {
                                  shouldDirty: true,
                                })
                              }}
                            >
                              {subsystem.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  subsystem.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Si no encuentras el subsistema, puedes crearlo
                  <Link
                    href="/dashboard/abastecimiento/inventario/subsistema"
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'h-[1px]'
                    )}
                  >
                    Crear Subsistema
                  </Link>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={control}
        name="numero_parte"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Número de Parte o Modelo</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Numero de parte o modelo"
                {...field}
                value={field.value || ''}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-1 gap-4">
        <FormField
          control={control}
          name="stock_minimo"
          rules={{
            required: true,
            min: 0,
            max: 1000000,
            validate: (value) => {
              if (getValues('stock_maximo')) {
                if (value > getValues('stock_maximo')) {
                  return 'El stock minimo no puede ser mayor al stock maximo'
                }
                return true
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Stock Mínimo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa el stock mínimo"
                  {...field}
                  onChange={(event) => {
                    field.onChange(parseInt(event.target.value))
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="stock_maximo"
          rules={{
            required: false,
            validate: (value) => {
              if (getValues('stock_minimo')) {
                if (value < getValues('stock_minimo')) {
                  return 'El stock maximo no puede ser menor al stock minimo'
                }
                return true
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Stock Máximo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingresa el stock máximo"
                  {...field}
                  onChange={(event) => {
                    field.onChange(parseInt(event.target.value))
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormLabel>Selecciona una imagen:</FormLabel>
      <div className="flex flex-1 gap-4">
        {watch('imagen') && !image ? (
          <Image
            src={watch('imagen')}
            alt={'Imagen del renglón'}
            width={250}
            height={250}
          />
        ) : null}

        <ImageUpload setFile={setImage} />
      </div>

      {
        <FormField
          control={control}
          name="peso"
          rules={{
            required: false,
          }}
          // disabled={weight > 0 ? true : false}
          render={({ field: { value, ref, ...rest } }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Peso por unidad (Opcional): </FormLabel>
              <FormDescription>
                {' '}
                {`No se puede modificar este campo porque el renglón ya tiene una unidad de empaque con un peso establecido.`}{' '}
              </FormDescription>
              <FormControl>
                <NumericFormat
                  className="w-[100px] rounded-md border-1 border-border p-1.5 text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  allowNegative={false}
                  thousandSeparator=""
                  decimalSeparator="."
                  prefix=""
                  decimalScale={2}
                  getInputRef={ref}
                  value={weight || 0}
                  //disable this numericformat using keyDown
                  onKeyDown={(e) => {
                    if (weight > 0) {
                      e.preventDefault()
                    }
                  }}
                  {...rest}
                />
                {/* <Input
                  type="number"
                  placeholder="Ingresa el peso del renglón"
                  {...field}
                  onChange={(value) => {
                    field.onChange(parseFloat(value.target.value))
                  }}
                  value={field.value}
                  // disabled={weight > 0 ? true : false}
                /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    </div>
  )
}
