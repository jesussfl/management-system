'use client'
import { FormDescription } from '@/modules/common/components/form'

import { Card, CardContent } from '@/modules/common/components/card/card'

import { ReceptionFieldsByQuantity } from './card-quantity-fields'
import { SelectedItemCardHeader } from '../../../selected-item-card-header'
import { useItemCardContext } from '@/lib/context/selected-item-card-context'

export const SelectedItemCard = () => {
  const { isError } = useItemCardContext()

  return (
    <Card className={`flex flex-col gap-4 ${isError ? 'border-red-400' : ''}`}>
      <SelectedItemCardHeader />

      <CardContent className="flex flex-1 flex-col justify-start">
        <ReceptionFieldsByQuantity />

        <FormDescription className={`${isError ? 'text-red-500' : ''}`}>
          {isError}
        </FormDescription>
      </CardContent>
    </Card>
  )
}
