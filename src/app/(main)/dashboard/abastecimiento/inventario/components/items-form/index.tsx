'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Form } from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { Renglon } from '@prisma/client'
import {
  createItem,
  updateItem,
  checkItemExistance,
} from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { Step1 } from './step-1'
import { Step2 } from './step-2'
import { Step3 } from './step-3'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
interface Props {
  defaultValues?: Renglon
  close?: () => void
}
type FormValues = Omit<Renglon, 'id'>

/**
 * Form component that allows the user to add or update a "row item" with multiple steps and form validation.
 */
export default function ItemsForm({ defaultValues }: Props): React.JSX.Element {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues,
  })

  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(1)
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createItem(data).then(() => {
          toast({
            title: 'Renglon creado',
            description: 'El renglon se ha creado correctamente',
            variant: 'success',
          })
          router.back()
        })

        return
      }

      if (!isDirty) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }
      const dirtyValues = getDirtyValues(dirtyFields, data) as FormValues
      updateItem(defaultValues.id, dirtyValues).then(() => {
        toast({
          title: 'Renglon actualizado',
          description: 'El renglon se ha actualizado correctamente',
          variant: 'success',
        })
        router.back()
      })
    })
  }

  const validateAndProceed = async (
    fields: Array<keyof FormValues>
  ): Promise<void> => {
    await form.trigger(fields)

    if (!Object.values(form.formState.errors).some(Boolean)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleNextStep = async () => {
    switch (currentStep) {
      case 1:
        setIsLoading(true)
        const name = form.getValues('nombre')

        const itemExists = await checkItemExistance(name)

        if (itemExists && !defaultValues) {
          form.setError('nombre', {
            type: 'custom',
            message: 'Ya existe un renglón con este nombre',
          })
          setIsLoading(false)

          return
        }

        await validateAndProceed(['nombre', 'descripcion'])

        setIsLoading(false)
        break

      case 2:
        await validateAndProceed([
          'clasificacionId',
          'unidadEmpaqueId',
          'categoriaId',
        ])
        break

      case 3:
        await validateAndProceed([
          'stock_minimo',
          'stock_maximo',
          'numero_parte',
        ])
        break

      default:
        break
    }
  }

  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1)
  }
  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto p-6 mb-10 gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          {(form.formState.errors.nombre ||
            form.formState.errors.descripcion) && (
            <p className="text-sm font-medium text-destructive">
              Corrige los campos en rojo
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Paso {currentStep} de {'3'}
          </p>
          <Button
            variant="outline"
            disabled={currentStep === 1}
            onClick={(e) => {
              e.preventDefault()
              handleBackStep()
            }}
          >
            Volver
          </Button>

          <Button
            disabled={isPending || isLoading}
            onClick={(e) => {
              if (currentStep === 3) return

              e.preventDefault()
              handleNextStep()
            }}
          >
            {isPending || isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : currentStep === 3 ? (
              'Guardar'
            ) : (
              'Siguiente'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
