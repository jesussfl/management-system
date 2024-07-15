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
import { assignFacialID, deleteDbFacialID } from '../../lib/actions/users'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import { FileWarning, Plus } from 'lucide-react'
import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'
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
import { NumericFormat } from 'react-number-format'
import { Icons } from '@/modules/common/components/icons/icons'

type FormValues = {
  facial_pin: string
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
    startTransition(async () => {
      let response = await faceio
        .enroll({
          locale: 'es',
          payload: {
            pin: `${values.facial_pin}`,
            email: `${email}`,
          },
          userConsent: true,
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

      assignFacialID(id, response.facialId, values.facial_pin).then(
        async (data) => {
          if (data?.success) {
            try {
              const res = await fetch(
                `/api/set-facial-pin?facialId=${response.facialId}&facialPin=${values.facial_pin}`,
                {
                  method: 'POST',
                }
              )

              const data = await res.json()

              if (res.status === 200) {
                console.log('Facial pin asignado')
              } else {
                console.error(data.error)
              }
            } catch (error) {
              console.error('Error:', error)
            }

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
        className="flex-1 flex justify-center overflow-y-auto px-8 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4 w-[500px]">
          <Alert variant={'destructive'} className="mb-8">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Desde aquí puedes asignar o actualizar el ID Facial de un usuario.
            </AlertDescription>
          </Alert>

          <FormField
            control={form.control}
            name="facial_pin"
            rules={{
              required: 'El pin es requerido',
              minLength: {
                value: 4,
                message: 'El pin debe tener al menos 4 caracteres',
              },
              maxLength: {
                value: 16,
                message: 'El pin debe tener al menos 16 caracteres',
              },
            }}
            render={({
              field: { ref, onChange, ...rest },
              fieldState: { error },
            }) => (
              <FormItem>
                <FormLabel>Pin de desbloqueo</FormLabel>
                <FormDescription>
                  Se te solicitará este pin de desbloqueo más adelante
                </FormDescription>
                <FormControl>
                  <NumericFormat
                    className="rounded-md border-1 border-border  text-foreground bg-background   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    allowNegative={false}
                    thousandSeparator=""
                    prefix=""
                    decimalScale={0}
                    maxLength={16}
                    getInputRef={ref}
                    onValueChange={({ value }) => onChange(value)}
                    {...rest}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Asignar ID Facial al usuario
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
