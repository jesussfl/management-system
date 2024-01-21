'use client'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/utils/utils'
import { Button } from '@/modules/common/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { FormControl } from '@/modules/common/components/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'

type ComboboxProps = {
  name: string
  data: { label: string; value: number }[]
  field: any
  form: any
  disabled?: boolean
}
export function Combobox({ name, data, field, form, disabled }: ComboboxProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              'justify-between',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value
              ? data.find((info) => info.value === field.value)?.label
              : 'Seleccionar...'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup>
            {data.map((info) => (
              <CommandItem
                value={info.label}
                key={info.value}
                onSelect={() => {
                  if (form.formState.errors[name]) {
                    form.clearErrors(name)
                  }
                  form.setValue(name, Number(info.value))
                }}
              >
                {info.label}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    info.value === field.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
