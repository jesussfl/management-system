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
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

type props = {
  title: string
  description: string
  sectionName?: SECTION_NAMES
  actionMethod: () => Promise<{
    error: boolean | string | null
    success: boolean | string | null
  }>
}

export const DeleteDialog = ({ title, description, actionMethod }: props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleActionMethod = async () => {
    setIsLoading(true)
    actionMethod().then((res) => {
      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error,
          variant: 'destructive',
        })

        return
      }

      if (res?.success) {
        toast({
          title: `${res.success}`,
          variant: 'success',
        })
      }
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
