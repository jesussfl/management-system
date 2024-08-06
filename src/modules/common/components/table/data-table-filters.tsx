'use client'
import React, { useState } from 'react'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import { useToast } from '../toast/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { KeyboardIcon, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import { getCurrentLayout } from '@/utils/helpers/get-keyboard-layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/select'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

interface MultipleDeleteProps {
  isMultipleDeleteEnabled: true
  selectedIds: number[]
  multipleDeleteAction: (ids: number[]) => Promise<{
    error: boolean | null | string
    success: boolean | null | string
  }>
}

interface SingleDeleteProps {
  isMultipleDeleteEnabled?: false
  selectedIds?: null
  multipleDeleteAction?: null
}

type FiltersProps = {
  table: any
  isColumnFilterEnabled: boolean
  filtering: any
  setFiltering: (filtering: any) => void
} & (MultipleDeleteProps | SingleDeleteProps)

export default function DataTableFilters({
  table,
  isColumnFilterEnabled,
  filtering,
  setFiltering,
  selectedIds,
  multipleDeleteAction,
  isMultipleDeleteEnabled,
}: FiltersProps) {
  const { toast } = useToast()
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [language, setLanguage] = useState('english')
  const handleLanguageChange = (language: string) => {
    const selectedLanguage = language
    setLanguage(selectedLanguage)
  }
  return (
    <div className="flex flex-1 justify-between items-center py-4">
      <div className="flex justify-start flex-1 gap-4">
        <div className="flex w-[50%] gap-4">
          <Input
            placeholder="Buscar..."
            value={filtering}
            onChange={(event) => setFiltering(event.target.value)}
            startIcon={Search}
            // value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
            // onChange={(event) =>
            //   table.getColumn('nombre')?.setFilterValue(event.target.value)
            // }
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
                  <h4 className="font-medium leading-none">Teclado Virtual</h4>
                </div>
                <Select
                  onValueChange={handleLanguageChange}
                  defaultValue={'spanish'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar idioma..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="english">Inglés</SelectItem>
                    <SelectItem value="russian">Ruso</SelectItem>
                    <SelectItem value="french">Frances</SelectItem>
                    <SelectItem value="japanese">Japones</SelectItem>
                    <SelectItem value="korean">Coreano</SelectItem>
                    <SelectItem value="chinese">Chino</SelectItem>
                    <SelectItem value="arabic">Arabe</SelectItem>
                    <SelectItem value="turkish">Turco</SelectItem>
                    <SelectItem value="german">Alemán</SelectItem>
                  </SelectContent>
                </Select>
                <Keyboard
                  onChange={(e) => {
                    const value = e
                    setFiltering(value)
                  }}
                  inputName={'keyboard'}
                  value={inputValue}
                  {...getCurrentLayout(language)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-4">
        {isColumnFilterEnabled && (
          <DataTableFacetedFilter
            column={table.getColumn('Estado')}
            title="Estado"
          />
        )}
        {isMultipleDeleteEnabled === true && selectedIds.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="ml-auto">
                Eliminar {selectedIds.length} elementos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Deseas eliminar los elementos seleccionados?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const response = await multipleDeleteAction(selectedIds)

                    if (response.success) {
                      toast({
                        description: 'Elementos eliminados correctamente',
                        title: 'Éxito',
                        variant: 'success',
                      })
                      table.resetRowSelection()
                    }

                    if (response.error) {
                      toast({
                        description: response.error,
                        title: 'Error',
                        variant: 'destructive',
                      })
                    }
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  )
}
