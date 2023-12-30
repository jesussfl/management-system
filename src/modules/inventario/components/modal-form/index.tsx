'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RenglonesForm from '@/modules/renglones/components/renglones-form'
import { Button } from '@/modules/common/components/button'

export default function ModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={'sm'}>
          Nuevo Renglón
        </Button>
      </DialogTrigger>
      <DialogContent
        className={'lg:max-w-screen-lg max-h-[94%] overflow-hidden px-0'}
      >
        <DialogHeader className="px-6 pb-4 border-b border-border">
          <DialogTitle>Nuevo Renglón</DialogTitle>
          <DialogDescription>
            Agrega un nuevo renglón a la base de datos de abastecimiento
          </DialogDescription>
        </DialogHeader>

        <RenglonesForm />
      </DialogContent>
    </Dialog>
  )
}
