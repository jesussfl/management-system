'use client'
import { useState } from 'react'

import { Button } from '@/modules/common/components/button'

import ModalForm from '@/modules/common/components/modal-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
export const ItemSelector = ({
  children,
  disabled,
}: {
  children: React.ReactNode
  disabled?: boolean
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toogleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <ModalForm
      triggerName="Seleccionar Renglones"
      closeWarning={false}
      open={isModalOpen}
      customToogleModal={toogleModal}
      disabled={disabled}
    >
      <div className="flex flex-col gap-4 p-8">
        <CardTitle>Selecciona los Renglones</CardTitle>
        {children}
        <Button
          className="sticky bottom-8 left-8 w-[200px]"
          variant={'default'}
          onClick={() => setIsModalOpen(false)}
        >
          Listo
        </Button>
      </div>
    </ModalForm>
  )
}

export const SelectedItemsContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Detalle la información de cada renglón seleccionado
        </CardTitle>
        <CardDescription>
          Es necesario que cada renglón contenga la información correspondiente
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 pt-4">
        <div className="grid gap-4 xl:grid-cols-2">{children}</div>
      </CardContent>
    </Card>
  )
}
