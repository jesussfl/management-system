'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { useRouter } from 'next/navigation'
import {
  assignFacialID,
  deleteDbFacialID,
  updateUserPassword,
} from '../../lib/actions/users'
import { Input } from '@/modules/common/components/input/input'
import { validatePassword } from '@/utils/helpers/validate-password'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import { FileWarning, Rocket, Trash } from 'lucide-react'
import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
import ModalForm from '@/modules/common/components/modal-form'
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

// type User = Prisma.UsuarioGetPayload<{ include: { rol: true } }>
type FormValues = {
  password: string
  confirmPassword: string
  adminPassword: string
}
interface Props {
  id: string
  email?: string | null
  adminPassword: string
  currentFacialID?: string | null
}

export default function ChangeUserFacialIDForm({
  id,
  email,
  adminPassword,
  currentFacialID,
}: Props) {
  const { toast } = useToast()
  const { faceio } = useFaceio()

  const router = useRouter()

  const form = useForm<FormValues>({ mode: 'onChange' })
  const [isPending, startTransition] = React.useTransition()
  const deleteFacialId = async () => {
    console.log(
      'Deleting facial ID... ',
      process.env.NEXT_PUBLIC_FACEIO_API_KEY
    )
    if (!currentFacialID) return
    console.log(currentFacialID)

    try {
      const res = await fetch(
        `/api/delete-facialId?facialId=${currentFacialID}`,
        {
          method: 'GET',
        }
      )

      const data = await res.json()

      if (res.status === 200) {
        const dbres = await deleteDbFacialID(id)
        console.log(
          'Facial ID, datos de carga útil y hash biométrico eliminados de esta aplicación'
        )
        toast({
          title: 'ID Facial Eliminado',
          description: 'El usuario se ha actualizado correctamente',
          variant: 'success',
        })
      } else {
        console.error(data.error)
        toast({
          title: 'Parece que hubo un error',
          description: data.error,
          variant: 'destructive',
          action: (
            <ToastAction
              altText="Intentar de nuevo"
              onClick={() => {
                window.location.reload()
              }}
            >
              Recargar página
            </ToastAction>
          ),
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Parece que hubo un error',
        description: 'Error desconocido',
        variant: 'destructive',
        action: (
          <ToastAction
            altText="Intentar de nuevo"
            onClick={() => {
              window.location.reload()
            }}
          >
            Recargar página
          </ToastAction>
        ),
      })
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    // if (values.password !== adminPassword) {
    //   console.log('Contraseña incorrecta', values.password, adminPassword)
    //   return
    // }

    startTransition(async () => {
      let response = await faceio
        .enroll({
          locale: 'es',
          payload: {
            email: `${email}`,
          },
          permissionTimeout: 15,
          enrollIntroTimeout: 4,
        })
        .catch(async (error: faceioErrorCode) => {
          console.log(error)

          const errorMessage = errorMessages[error] || error.toString()

          toast({
            title: 'Parece que hubo un error, se recargara la página',
            description: errorMessage,
            variant: 'destructive',
            action: (
              <ToastAction
                altText="Intentar de nuevo"
                onClick={() => {
                  window.location.reload()
                }}
              >
                Recargar página
              </ToastAction>
            ),
          })

          await new Promise((resolve) => setTimeout(resolve, 5000))
          window.location.reload()
        })

      console.log(` Unique Facial ID: ${response.facialId}
      Enrollment Date: ${response.timestamp}
      Gender: ${response.details.gender}
      Age Approximation: ${response.details.age}`)
      assignFacialID(id, response.facialId, values.adminPassword).then(
        (data) => {
          if (data?.success) {
            toast({
              title: 'ID Facial Asignado',
              description: 'El usuario se ha actualizado correctamente',
              variant: 'success',
            })

            router.back()
          }
        }
      )
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto px-8 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Alert variant={'destructive'}>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Desde aquí puedes asignar o actualizar el ID Facial de un usuario.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="adminPassword"
          rules={{
            required: 'Contraseña de administrador requerida',
            validate: validateAdminPassword,
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Contraseña del administrador</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isPending}
                  placeholder="**********"
                />
              </FormControl>
              <FormDescription>
                Para realizar esta acción necesitas la contraseña de
                administrador.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Eliminar ID Facial</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás seguro de eliminar el ID Facial de este usuario?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Deberás realizar una nueva verificación
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={deleteFacialId}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="default" type="submit">
            Asignar ID Facial
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
