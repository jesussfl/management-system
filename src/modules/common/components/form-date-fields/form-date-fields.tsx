'use client'

import { Button } from '@/modules/common/components/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { TrashIcon } from 'lucide-react'
import {
  CardDescription,
  CardTitle,
} from '@/modules/common/components/card/card'
import ModalForm from '@/modules/common/components/modal-form'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { startOfDay } from 'date-fns'
import { Input } from '@/modules/common/components/input/input'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import { useToast } from '@/modules/common/components/toast/use-toast'

interface FormDateFieldsProps {
  isEditEnabled: boolean
  config: {
    dateLabel: string
    dateName: string
    dateDescription: string
  }
}
export const FormDateFields = ({
  config,
  isEditEnabled,
}: FormDateFieldsProps) => {
  const form = useFormContext()
  const { toast } = useToast()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const toogleAlert = () => {
    const fecha = form.watch(config.dateName)

    if (fecha < startOfDay(new Date())) {
      form.resetField(config.dateName)
    }
  }
  return (
    <>
      <FormField
        control={form.control}
        name="motivo"
        rules={{
          required: 'Este campo es obligatorio',
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
                Redacta el motivo por el cual se están registrando los
                siguientes renglones...
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
        name={config.dateName}
        rules={{
          required: true,
          validate: (value) => {
            if (value > new Date())
              return 'La fecha no puede ser mayor a la actual'
          },
        }}
        render={({ field }) => (
          <FormItem className="flex flex-row flex-1 justify-between items-center gap-5 ">
            <div className="w-[20rem]">
              <FormLabel>{config.dateLabel}</FormLabel>
              <FormDescription>{config.dateDescription}</FormDescription>
            </div>
            <div>
              <div className="flex gap-2">
                <DatePicker
                  placeholderText="Seleccionar fecha"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  locale={es}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  showTimeSelect
                  dateFormat="d MMMM, yyyy h:mm aa"
                  dropdownMode="select"
                  maxDate={new Date()}
                  className="rounded-md border-1 border-border text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      {form.watch(config.dateName) < startOfDay(new Date()) &&
      isAuthorized === false &&
      !isEditEnabled ? (
        <ModalForm
          triggerName=" Parece que estás colocando una fecha anterior a la actual"
          closeWarning={false}
          open={
            !isEditEnabled &&
            form.watch(config.dateName) < startOfDay(new Date())
          }
          customToogleModal={toogleAlert}
          className="w-[550px]"
        >
          <div className="flex flex-col gap-4 p-8">
            <CardTitle>
              Estas colocando una fecha anterior a la fecha actual
            </CardTitle>
            <CardDescription>
              Para evitar inconsistencias de información, debes colocar el
              motivo de la fecha y colocar la contraseña de administrador.
            </CardDescription>
            <Input
              className="w-full"
              placeholder="Contraseña del administrador"
              type="password"
              onChange={(e) => {
                const value = e.target.value

                setAdminPassword(value)
              }}
            />
            <Button
              className="w-[200px]"
              variant={'default'}
              onClick={(e) => {
                e.preventDefault()
                validateAdminPassword(adminPassword).then((res) => {
                  if (!adminPassword) return
                  if (res === true) {
                    setIsAuthorized(true)
                    toast({
                      title: 'Fecha autorizada',
                      description: 'La fecha ha sido autorizada',
                      variant: 'success',
                    })

                    return
                  }

                  setAdminPassword('')
                  toast({
                    title: 'Permiso denegado',
                    description: 'La contraseña es incorrecta',
                    variant: 'destructive',
                  })
                })
              }}
            >
              Listo
            </Button>
          </div>
        </ModalForm>
      ) : null}
      {form.watch(config.dateName) < startOfDay(new Date()) &&
      (isAuthorized === true || isEditEnabled) ? (
        <FormField
          control={form.control}
          name="motivo_fecha"
          rules={{
            required: 'Este campo es obligatorio',
            maxLength: {
              value: 200,
              message: 'Debe tener un máximo de 200 carácteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="">
              <div className="flex flex-col gap-1">
                <FormLabel>
                  Introduzca el motivo de por qué la fecha es anterior a la
                  actual
                </FormLabel>
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
      ) : null}
    </>
  )
}
