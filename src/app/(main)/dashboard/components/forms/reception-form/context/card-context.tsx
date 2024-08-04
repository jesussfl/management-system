import { ItemsWithAllRelations } from '@/lib/actions/item'
import React, { createContext, useState, ReactNode, useContext } from 'react'
type Renglon = ItemsWithAllRelations[number]

interface SelectedItemCardContextProps {
  index: number
  isEditing: boolean
  isError: string | boolean
  itemData: Renglon
  section: 'Abastecimiento' | 'Armamento'
  removeCard: () => void
  setItemsWithoutSerials: React.Dispatch<React.SetStateAction<number[]>>
}

// Crea el contexto con un valor por defecto
const SelectedItemCardContext = createContext<
  SelectedItemCardContextProps | undefined
>(undefined)

export const SelectedItemCardProvider: React.FC<
  {
    children: ReactNode
  } & SelectedItemCardContextProps
> = ({
  children,
  itemData,
  section,
  index,
  isError,
  isEditing,
  removeCard,
  setItemsWithoutSerials,
}) => {
  return (
    <SelectedItemCardContext.Provider
      value={{
        index,
        isEditing,
        isError,
        section,
        itemData,
        removeCard,
        setItemsWithoutSerials,
      }}
    >
      {children}
    </SelectedItemCardContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useSelectedItemCardContext = () => {
  const context = useContext(SelectedItemCardContext)
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider')
  }
  return context
}
