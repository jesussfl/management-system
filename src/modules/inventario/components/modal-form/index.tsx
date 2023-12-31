'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RowItemForm from '@/modules/inventario/components/rowitem-form'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'

export default function ModalForm() {
  const [isOpen, setIsOpen] = useState(false)

  const toogleModal = () => setIsOpen(!isOpen)
  console.log(isOpen)
  return (
    <Dialog open={isOpen} onOpenChange={toogleModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size={'sm'} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Renglón
        </Button>
      </DialogTrigger>
      <DialogContent
        className={'lg:max-w-screen-lg h-[94%] overflow-hidden p-0'}
      >
        <RowItemForm close={toogleModal} />
      </DialogContent>
    </Dialog>
  )
}
