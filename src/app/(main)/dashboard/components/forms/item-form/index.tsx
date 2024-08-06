'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Form } from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { Renglon } from '@prisma/client'
import { createItem, updateItem, checkItemExistance } from '@/lib/actions/item'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { Step1 } from './step-1'
import { Step2 } from './step-2'
import { Step3 } from './step-3'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
interface Props {
  defaultValues?: Renglon
  section: 'Abastecimiento' | 'Armamento'
}

/**
 * Form component that allows the user to add or update a "row item" with multiple steps and form validation.
 */
export default function ItemsForm({
  defaultValues,
  section,
}: Props): React.JSX.Element {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()

  const form = useForm<Renglon>({
    mode: 'all',
    defaultValues,
  })

  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [image, setImage] = React.useState<FormData | null>(null)

  const [ref, setRef] = React.useState<any>(null)
  const onSubmit: SubmitHandler<Renglon> = async (data) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createItem(data, image, section).then((res) => {
          if (res?.error) {
            toast({
              title: 'Error',
              description: res?.error,
              variant: 'destructive',
            })
            return
          }

          toast({
            title: 'Renglon creado',
            description: 'El renglon se ha creado correctamente',
            variant: 'success',
          })
          router.back()
        })

        return
      }

      if (!isDirty && !image) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }
      const dirtyValues = getDirtyValues(dirtyFields, data) as Renglon
      updateItem(defaultValues.id, dirtyValues, image, section).then(() => {
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
    fields: Array<keyof Renglon>,
    step: number
  ): Promise<void> => {
    form.trigger(fields).then((res) => {
      if (res || step < currentStep) {
        setCurrentStep((step) => step + 1)
      }
    })
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

        await validateAndProceed(['nombre', 'descripcion'], 1)

        setIsLoading(false)
        break

      case 2:
        await validateAndProceed(['clasificacionId', 'categoriaId'], 2)
        break

      case 3:
        await validateAndProceed(
          ['stock_minimo', 'stock_maximo', 'numero_parte'],
          3
        )
        break

      default:
        break
    }
  }

  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  React.useEffect(() => {
    ref?.scrollTo(0, 0)
  }, [currentStep, ref])
  return (
    <div
      ref={(ref) => setRef(ref)}
      style={{
        scrollbarGutter: 'stable both-edges',
      }}
      className="flex-1 overflow-y-auto p-6 pb-20 gap-8"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-24 ">
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 image={image} setImage={setImage} />}
          </div>

          <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
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
    </div>
  )
}
