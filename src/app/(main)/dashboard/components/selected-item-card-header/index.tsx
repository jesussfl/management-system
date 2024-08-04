'use client'
import { Button } from '@/modules/common/components/button'
import { Package, Trash } from 'lucide-react'

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { AlertDialogImage } from '@/modules/common/components/alert-dialog/alert-dialog-image'
import { useSelectedItemCardContext } from '../forms/reception-form/context/card-context'

export const SelectedItemCardHeader = () => {
  const { itemData, removeCard, isEditing } = useSelectedItemCardContext()
  const description = `Descripción: ${itemData?.descripcion} `
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        {!itemData.imagen ? (
          <Package className="w-12 h-8" />
        ) : (
          <AlertDialogImage imageUrl={itemData.imagen} />
        )}
        <div className="flex flex-col">
          <CardTitle className="text-md font-medium text-foreground">
            {itemData.nombre}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isEditing}>
            <Trash className="h-5 w-5 text-red-800 cursor-pointer" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de descartar este Renglón?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se descartarán los datos que hayas ingresado
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={removeCard}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardHeader>
  )
}
