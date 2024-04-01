'use client'
import { useState, cloneElement, Children } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import ItemsForm from '@/app/(main)/dashboard/abastecimiento/inventario/components/items-form'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'

type Props = {
  children: React.ReactNode
  triggerName: string
  triggerVariant?:
    | 'ghost'
    | 'outline'
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'link'
}

export default function ModalForm({
  children,
  triggerName,
  triggerVariant,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const toogleModal = () => setIsOpen(!isOpen)

  const childrenWithProps = cloneElement(children as React.ReactElement, {
    close: toogleModal,
  })

  return (
    <Dialog open={isOpen} onOpenChange={toogleModal}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant || 'default'}
          size={'sm'}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {triggerName}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={'lg:max-w-screen-lg h-[94%] overflow-hidden p-0'}
      >
        {childrenWithProps}
        {/* <RowItemForm close={toogleModal} /> */}
      </DialogContent>
    </Dialog>
  )
}
