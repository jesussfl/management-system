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
import { useEffect, useState, useTransition } from 'react'
import { cn } from '@/utils/utils'
import { buttonVariants } from '@/modules/common/components/button'
import { ComboboxData } from '@/types/types'
import { Switch } from '@/modules/common/components/switch/switch'
import Link from 'next/link'
import ImageUpload from '@/modules/common/components/file-upload'
import Image from 'next/image'
import { NumericFormat } from 'react-number-format'
import { Combobox } from '@/modules/common/components/combobox'

import { getAllWarehouses } from '@/app/(main)/dashboard/almacenes/lib/actions/warehouse'
import usePackageInfo from '../../../../../../lib/hooks/use-package-info'
import { getAllSubsystems } from '@/lib/actions/subsystems'
import { MEDIDAS } from '../packaging-units-form'

export const Step3 = ({
  image,
  setImage,
}: {
  image: FormData | null
  setImage: (image: FormData | null) => void
}) => {
  const form = useFormContext()
  const subsystemId = form.watch('id_subsistema')
  const { weight, measureType } = usePackageInfo()
  const [subsystems, setSubsystems] = useState<ComboboxData[]>([])
  const [warehouses, setWarehouses] = useState<ComboboxData[]>([])
  const [hasSubsystem, setHasSubsystem] = useState(subsystemId ? true : false)

  const isPackageForLiquids =
    measureType === 'LITROS' || measureType === 'MILILITROS'
  useEffect(() => {
    getAllSubsystems(true).then((data) => {
      const transformedData = data.map((subsystem) => ({
        value: subsystem.id,
        label: `${subsystem.nombre} - ${subsystem.sistema.nombre}`,
      }))

      setSubsystems(transformedData)
    })
    getAllWarehouses(true).then((data) => {
      const transformedData = data.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.nombre,
      }))
      setWarehouses(transformedData)
    })
  }, [])

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
        control={form.control}
        name="id_almacen"
        rules={{ required: 'Este campo es requerido' }}
        render={({ field }) => (
          <FormItem className="flex flex-col w-full ">
            <FormLabel>En qué almacen se encuentra:</FormLabel>

            <Combobox
              name={field.name}
              data={warehouses}
              form={form}
              field={field}
            />
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
              form.setValue('id_subsistema', null, { shouldDirty: true })
              setHasSubsystem(false)
            }
          }}
        />
        <FormDescription>Si</FormDescription>
      </div>
      {hasSubsystem && (
        <>
          <FormField
            control={form.control}
            name="id_subsistema"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Subsistema:</FormLabel>
                <Combobox
                  name={field.name}
                  data={subsystems}
                  form={form}
                  field={field}
                />
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
        control={form.control}
        name="numero_parte"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Número de Parte o Modelo (Opcional)</FormLabel>
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
          control={form.control}
          name="pasillo"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Pasillo</FormLabel>

              <FormControl>
                <Input
                  type="text"
                  placeholder="Ej. 1, 2, 3, etc."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estante"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Estante</FormLabel>

              <FormControl>
                <Input
                  type="text"
                  placeholder="Ej. A, B, C, etc."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="peldano"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Peldaño</FormLabel>

              <FormControl>
                <Input type="text" {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="referencia"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Punto de Referencia (Opcional)</FormLabel>
            <FormDescription>
              Escribe un punto de referencia dentro del almacén para saber su
              ubicación
            </FormDescription>
            <FormControl>
              <Input
                type="text"
                placeholder="Ej. Pasillo, Estante, Cajón, etc."
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
          control={form.control}
          name="stock_minimo"
          rules={{
            required: true,
            min: 0,
            max: 1000000,
            validate: (value) => {
              if (form.getValues('stock_maximo')) {
                if (value > form.getValues('stock_maximo')) {
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
          control={form.control}
          name="stock_maximo"
          rules={{
            required: true,
            validate: (value) => {
              if (form.getValues('stock_minimo')) {
                if (value < form.getValues('stock_minimo')) {
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
      <FormLabel>Selecciona una imagen (Opcional):</FormLabel>
      <div className="flex flex-1 gap-4">
        {form.watch('imagen') && !image ? (
          <Image
            src={form.watch('imagen')}
            alt={'Imagen del renglón'}
            width={250}
            height={250}
          />
        ) : null}

        <ImageUpload setFile={setImage} />
      </div>

      {!isPackageForLiquids ? (
        <div className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name="tipo_medida_unidad"
            rules={{
              required: 'Este campo es requerido',
            }}
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col gap-2">
                <FormLabel>Unidad de Medida</FormLabel>

                <Combobox
                  name={field.name}
                  data={MEDIDAS}
                  form={form}
                  field={field}
                  isValueString={true}
                />
                <FormDescription>
                  Selecciona en qué tipo de medida se maneja el renglón, Ej. Una
                  botella se maneja en litros.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="peso"
            rules={{
              required: false,
            }}
            render={({ field: { value, onChange, ref, ...rest } }) => (
              <FormItem className="flex-1">
                <FormLabel>Peso por Unidad (Opcional): </FormLabel>

                <FormControl>
                  <div className="flex items-center gap-2">
                    <NumericFormat
                      className="w-[100px] rounded-md border-1 border-border p-1.5 text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      allowNegative={false}
                      thousandSeparator=""
                      decimalSeparator="."
                      prefix=""
                      decimalScale={2}
                      getInputRef={ref}
                      value={weight || ''}
                      onValueChange={({ floatValue }) => {
                        onChange(floatValue)
                      }}
                      {...rest}
                      disabled={weight > 0 ? true : false}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : null}
    </div>
  )
}
