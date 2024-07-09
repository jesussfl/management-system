'use client'
import { useState, cloneElement } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'
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
import { cn } from '@/utils/utils'

type Props = {
  children: React.ReactNode
  open?: boolean
  close?: () => void
  triggerName: string
  height?: string
  triggerVariant?:
    | 'ghost'
    | 'outline'
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'link'
  disabled?: boolean
  triggerSize?: 'sm' | 'lg' | 'xl'
  closeWarning?: boolean
  className?: string
  triggerIcon?: React.ReactNode
  customToogleModal?: () => void
}

export default function ModalForm({
  children,
  triggerName,
  triggerVariant,
  disabled,
  triggerSize,
  height,
  close,
  open,
  triggerIcon,
  customToogleModal,
  closeWarning = true,
  className = '',
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const toogleModal = () => {
    if (!isOpen) {
      setIsOpen(true)
      return
    }
    closeWarning ? setShowWarning(true) : setIsOpen(false)
  }

  const closeWithWarning = () => {
    setIsOpen(false)
    setShowWarning(false)
  }

  const childrenWithProps = cloneElement(children as React.ReactElement, {
    close: toogleModal,
  })

  return (
    <Dialog
      open={open !== undefined ? open : isOpen}
      onOpenChange={customToogleModal ? customToogleModal : toogleModal}
    >
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant || 'default'}
          size={triggerSize || 'sm'}
          className="gap-2"
          disabled={disabled}
        >
          {' '}
          {triggerIcon ? triggerIcon : <Plus className="h-4 w-4" />}
          {triggerName}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          `lg:max-w-screen-lg overflow-x-hidden p-0 max-h-[90vh] overflow-y-auto`,
          className
        )}
      >
        {childrenWithProps}

        <AlertDialog open={showWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Estás seguro que deseas salir?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tus cambios no se guardarán
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowWarning(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={closeWithWarning}>
                Sí, salir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
