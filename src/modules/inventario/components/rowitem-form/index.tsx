'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Form } from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { Renglones } from '@prisma/client'
import {
  createRenglon,
  updateRenglon,
  checkRowItemExists,
} from '@/lib/actions/renglon'
import { useToast } from '@/modules/common/components/toast/use-toast'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { Step1 } from './step-1'
import { Step2 } from './step-2'
import { Step3 } from './step-3'

interface Props {
  defaultValues?: Renglones
  close?: () => void
}
type FormValues = Omit<Renglones, 'id'>

export default function RowItemForm({ defaultValues, close }: Props) {
  const { toast } = useToast()

  const form = useForm<FormValues>({
    criteriaMode: 'firstError',
    defaultValues,
  })
  const [currentStep, setCurrentStep] = React.useState(1)
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (defaultValues) {
      updateRenglon(defaultValues.id, data).then(() => {
        toast({
          title: 'Renglon actualizado',
          description: 'El renglon se ha actualizado correctamente',
          variant: 'success',
        })

        close && close()
      })
    } else {
      createRenglon(data).then(() => {
        toast({
          title: 'Renglon creado',
          description: 'El renglon se ha creado correctamente',
          variant: 'success',
        })
        close && close()
      })
    }
  }
  const handleNextStep = async () => {
    if (currentStep === 1) {
      checkRowItemExists(form.getValues('nombre')).then((res) => {
        console.log(res)
        if (res && !defaultValues) {
          form.setError('nombre', {
            type: 'custom',
            message: 'Ya existe un renglon con este nombre',
          })
        } else {
          form.trigger(['nombre', 'descripcion']).then(() => {
            if (
              !form.formState.errors.nombre &&
              !form.formState.errors.descripcion
            ) {
              setCurrentStep((prev) => prev + 1)
            }
          })
        }
      })
    }

    if (currentStep === 2) {
      form
        .trigger(['clasificacion', 'unidad_empaque', 'categoria', 'tipo'])
        .then(() => {
          if (
            form.formState.errors.clasificacion ||
            form.formState.errors.unidad_empaque ||
            form.formState.errors.categoria
          ) {
            return
          }
          setCurrentStep((prev) => prev + 1)
        })
      if (form.formState.errors) {
        return
      }
      setCurrentStep((prev) => prev + 1)
    }

    if (currentStep === 3) {
      form.trigger(['stock_minimo', 'stock_maximo', 'numero_parte'])
      if (form.formState.errors) {
        return
      }
      setCurrentStep((prev) => prev + 1)
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
        className="flex-1 overflow-y-scroll p-6 gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DialogHeader className="pb-3 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Agrega un nuevo renglón
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Paso {currentStep} de {'3'}
          </DialogDescription>
        </DialogHeader>
        <div className="px-24">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
        </div>

        <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t border-border gap-4 items-center">
          {(form.formState.errors.nombre ||
            form.formState.errors.descripcion) && (
            <p className="text-sm font-medium text-destructive">
              Corrige los campos en rojo
            </p>
          )}

          {currentStep < 3 && currentStep > 1 && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                handleBackStep()
              }}
            >
              Volver
            </Button>
          )}
          {currentStep < 3 && (
            <Button
              onClick={(e) => {
                e.preventDefault()
                handleNextStep()
              }}
            >
              Siguiente
            </Button>
          )}
          {currentStep === 3 && (
            <Button variant="default" type="submit">
              Guardar
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}
