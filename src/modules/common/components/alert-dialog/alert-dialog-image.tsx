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
import Image from 'next/image'
export const AlertDialogImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Image
          src={imageUrl || ''}
          alt={imageUrl || ''}
          width={50}
          height={50}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Imágen del Renglón</AlertDialogTitle>

          <Image
            src={imageUrl || ''}
            alt={imageUrl || ''}
            width={500}
            height={500}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
