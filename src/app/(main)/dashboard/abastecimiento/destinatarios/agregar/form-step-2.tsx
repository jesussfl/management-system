'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/modules/common/components/form'

import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/modules/common/components/button'

import 'react-phone-input-2/lib/style.css'
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
import { CheckIcon } from 'lucide-react'
import { useReceiversFormData } from '@/lib/hooks/use-receivers-form-data'

export const Step2 = () => {
  const form = useFormContext()
  const { categories, components, grades } = useReceiversFormData()

  return (
    <div className="flex flex-col gap-5 mb-8">
      <div className="flex gap-12">
        <FormField
          control={form.control}
          name="id_componente"
          render={({ field }) => (
            <FormItem className="flex flex-1 justify-between gap-4 items-center">
              <FormLabel>Componente:</FormLabel>
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
                          ? components.data.find(
                              (component) => component.value === field.value
                            )?.label
                          : 'Seleccionar componente'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="PopoverContent">
                    <Command>
                      <CommandInput
                        placeholder="Buscar componente..."
                        className="h-9"
                      />
                      <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                      <CommandGroup>
                        {components.isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          components.data.map((component) => (
                            <CommandItem
                              value={component.label}
                              key={component.value}
                              onSelect={() => {
                                form.setValue('id_componente', component.value)
                              }}
                            >
                              {component.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  component.value === field.value
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

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_grado"
          render={({ field }) => (
            <FormItem className="flex flex-1 justify-between gap-4 items-center">
              <FormLabel>Grado:</FormLabel>
              <div className="w-[70%]">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!form.watch('id_componente')}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? grades.data.find(
                              (grade) => grade.value === field.value
                            )?.label
                          : 'Seleccionar grado'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="PopoverContent">
                    <Command>
                      <CommandInput
                        placeholder="Buscar grado..."
                        className="h-9"
                      />
                      <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                      <CommandGroup>
                        {grades.isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          grades.data.map((grade) => (
                            <CommandItem
                              value={grade.label}
                              key={grade.value}
                              onSelect={() => {
                                form.setValue('id_grado', grade.value)
                              }}
                            >
                              {grade.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  grade.value === field.value
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

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="id_categoria"
        render={({ field }) => (
          <FormItem className="flex flex-1 justify-between gap-4 items-center">
            <FormLabel>Categoria:</FormLabel>
            <div className="w-[70%]">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      disabled={!form.watch('id_grado')}
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? categories.data.find(
                            (category) => category.value === field.value
                          )?.label
                        : 'Seleccionar categoría'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="PopoverContent">
                  <Command>
                    <CommandInput
                      placeholder="Buscar categoría..."
                      className="h-9"
                    />
                    <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                    <CommandGroup>
                      {categories.isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        categories.data.map((category) => (
                          <CommandItem
                            value={category.label}
                            key={category.value}
                            onSelect={() => {
                              form.setValue('id_categoria', category.value)
                            }}
                          >
                            {category.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                category.value === field.value
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

              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
