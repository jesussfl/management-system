'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { useRouter } from 'next/navigation'
import { Estados_Pedidos } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { updateOrderStatus } from '@/app/(main)/dashboard/lib/actions/order'
type FormValues = {
  estado: Estados_Pedidos | undefined | null
}
interface Props {
  orderId: number
  estado: Estados_Pedidos | undefined | null
}

export default function OrderStatusForm({ orderId, estado }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      estado,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    updateOrderStatus(orderId, values, 'Armamento').then((data) => {
      if (data?.success) {
        toast({
          title: 'Estado de pedido actualizada',
          description: `El estado del pedido se actualizó a: ${values.estado}`,
          variant: 'success',
        })

        router.back()
      }
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
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado del pedido:</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || 'En_proceso'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="En_proceso">En proceso</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Recibido">Recibido</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
