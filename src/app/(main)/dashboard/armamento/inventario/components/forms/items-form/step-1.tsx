'use client'
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
import { useState } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { Button } from '@/modules/common/components/button'
import { KeyboardIcon } from 'lucide-react'
import { getCurrentLayout } from '@/utils/helpers/get-keyboard-layout'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
export const Step1 = () => {
  const form = useFormContext()
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [language, setLanguage] = useState('english')

  const handleLanguageChange = (language: string) => {
    const selectedLanguage = language
    setLanguage(selectedLanguage)
  }

  return (
    <div className="flex flex-col gap-3 mb-8">
      <FormInstructions>
        <FormInstructionsTitle>
          Añade un nombre y descripción al renglón
        </FormInstructionsTitle>
        <FormInstructionsDescription>
          Ingresa un nombre descriptivo y una breve explicación para identificar
          este renglón en el armamento
        </FormInstructionsDescription>
      </FormInstructions>

      <FormField
        control={form.control}
        name="nombre"
        rules={{
          required: 'Este campo es necesario',
          minLength: {
            value: 3,
            message: 'Debe tener al menos 3 caracteres',
          },
          maxLength: {
            value: 70,
            message: 'Debe tener un máximo de 70 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Nombre del Renglón</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Ej: Aceite de Motor 5W-30, Martillo de Carpintero, Lápices HB"
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    if (form.formState.errors[field.name]) {
                      form.clearErrors(field.name)
                    }
                    const value = e.target.value
                    setInputValue(value)
                    form.setValue(field.name, value, {
                      shouldDirty: true,
                    })
                  }}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      onClick={(e) => {
                        setShowKeyboard(!showKeyboard)
                      }}
                    >
                      {showKeyboard ? (
                        <KeyboardIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <KeyboardIcon className="h-4 w-4 text-blue-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-200">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Teclado Virtual
                        </h4>
                      </div>
                      <Select
                        onValueChange={handleLanguageChange}
                        defaultValue={'spanish'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar idioma..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="spanish">Español</SelectItem>
                          <SelectItem value="english">Inglés</SelectItem>
                          <SelectItem value="russian">Ruso</SelectItem>
                          <SelectItem value="french">Francés</SelectItem>
                          <SelectItem value="japanese">Japonés</SelectItem>
                          <SelectItem value="korean">Coreano</SelectItem>
                          <SelectItem value="chinese">Chino</SelectItem>
                          <SelectItem value="arabic">Arabe</SelectItem>
                          <SelectItem value="turkish">Turco</SelectItem>
                          <SelectItem value="german">Alemán</SelectItem>
                        </SelectContent>
                      </Select>
                      <Keyboard
                        onChange={(e) => {
                          if (form.formState.errors[field.name]) {
                            form.clearErrors(field.name)
                          }
                          const value = e
                          setInputValue(value)
                          form.setValue(field.name, value, {
                            shouldDirty: true,
                          })
                        }}
                        inputName={field.name}
                        value={inputValue}
                        {...getCurrentLayout(language)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descripcion"
        rules={{
          required: 'Este campo es necesario',
          minLength: {
            value: 10,
            message: 'Debe tener al menos 10 caracteres',
          },
          maxLength: {
            value: 200,
            message: 'Debe tener un máximo de 200 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <textarea
                id="description"
                placeholder="Detalles específicos del renglón (por ejemplo, características, material, estado)"
                rows={3}
                className="w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...field}
                onChange={(e) => {
                  if (form.formState.errors[field.name]) {
                    form.clearErrors(field.name)
                  }
                  form.setValue(field.name, e.target.value, {
                    shouldDirty: true,
                  })
                }}
              />
            </FormControl>
            <FormDescription>
              Esta descripción ayudará a entender rápidamente este tipo de
              elemento dentro del inventario
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
