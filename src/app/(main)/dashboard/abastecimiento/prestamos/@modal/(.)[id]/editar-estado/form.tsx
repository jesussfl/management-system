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
import { Estados_Prestamos } from '@prisma/client'
import { updateOrderStatus } from '@/lib/actions/order'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { updateLoanStatus } from '@/lib/actions/loan'
type FormValues = {
  estado: Estados_Prestamos | undefined | null
}
interface Props {
  orderId: number
  estado: Estados_Prestamos | undefined | null
}

export default function LoanStatusForm({ orderId, estado }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      estado,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    updateLoanStatus(orderId, values, 'Abastecimiento').then((data) => {
      if (data?.success) {
        toast({
          title: 'Estado de préstamo actualizado',
          description: `El estado del préstamo se actualizó a: ${values.estado}`,
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
        className="mb-36 flex-1 gap-8 overflow-y-auto px-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado del préstamo:</FormLabel>
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
                  <SelectItem value="Prestado">Prestado</SelectItem>
                  <SelectItem value="Devuelto">Devuelto</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  {/* <SelectItem value="Recibido">Recibido</SelectItem> */}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="fixed bottom-0 right-0 w-full items-center gap-4 border-t border-border bg-white p-8 pt-4">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
