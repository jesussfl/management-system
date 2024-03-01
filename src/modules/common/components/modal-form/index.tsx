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
  closeWarning?: boolean
  className?: string
}

export default function ModalForm({
  children,
  triggerName,
  triggerVariant,
  disabled,
  height,
  close,
  open,
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
      onOpenChange={toogleModal}
    >
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant || 'default'}
          size={'sm'}
          className="gap-2"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          {triggerName}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(`lg:max-w-screen-lg overflow-hidden p-0`, className)}
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
