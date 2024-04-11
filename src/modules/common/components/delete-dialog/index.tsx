'use client'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/modules/common/components/alert-dialog'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../toast/use-toast'

type props = {
  title: string
  description: string
  actionMethod: () => Promise<void>
}

export const DeleteDialog = ({ title, description, actionMethod }: props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const handleActionMethod = async () => {
    setIsLoading(true)
    actionMethod()
      .then(() => {
        toast({
          title: 'Eliminado',
          description: 'Se eliminó correctamente',
          variant: 'success',
        })
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message,
        })
      })
    setIsLoading(false)
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleActionMethod}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Continuar'
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
