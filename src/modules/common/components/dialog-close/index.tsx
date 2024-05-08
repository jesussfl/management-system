'use client'
import { DialogClose } from '@/modules/common/components/dialog/dialog'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CloseButtonDialog({ route }: { route?: string }) {
  const router = useRouter()
  return (
    <DialogClose
      onClick={() => {
        if (route) {
          router.push(route)
          return
        }
        router.back()
      }}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      <X className="h-6 w-6" />
      <span className="sr-only">Cerrar</span>
    </DialogClose>
  )
}
