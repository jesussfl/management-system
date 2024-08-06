import { getCategoriesByClassificationId } from '@/lib/actions/categories'
import { getAllClassifications } from '@/lib/actions/classifications'
import { getAllPackagingUnits } from '@/lib/actions/packaging-units'
import { UnidadEmpaque } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
type ComboboxData = {
  value: number
  label: string
}
const useItemCreationData = () => {
  const { watch, setValue } = useFormContext()
  const [categories, setCategories] = useState<ComboboxData[]>([])
  const [classifications, setClassifications] = useState<ComboboxData[]>([])
  const [packagingUnits, setPackagingUnits] = useState<ComboboxData[]>([])

  const [isPackagingUnitsLoading, setIsPackagingUnitsLoading] = useState(false)
  const [isClassificationsLoading, setIsClassificationsLoading] =
    useState(false)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)
  const classificationId = watch('clasificacionId')

  // This effect is used to fetch classifications, categories, and packaging units when the component mounts
  useEffect(() => {
    setIsClassificationsLoading(true)
    setIsCategoriesLoading(true)
    setIsPackagingUnitsLoading(true)
    getAllClassifications(true).then((data) => {
      const transformedData = data.map((classification) => ({
        value: classification.id,
        label: classification.nombre,
      }))
      setClassifications(transformedData)
    })
    getAllPackagingUnits(true).then((data) => {
      const transformedData = data.map((packagingUnit) => ({
        value: packagingUnit.id,
        label: `${packagingUnit.nombre} ${
          packagingUnit.peso
            ? '(' + packagingUnit.peso + ' ' + packagingUnit.abreviacion + ')'
            : ''
        }`,
      }))
      setPackagingUnits(transformedData)
    })
    classificationId &&
      getCategoriesByClassificationId(classificationId).then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))
        setCategories(transformedData)
      })

    setIsClassificationsLoading(false)
    setIsCategoriesLoading(false)
    setIsPackagingUnitsLoading(false)
  }, [])

  // This effect is used to update categories and packaging units based on the selected fields
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'clasificacionId') {
        setIsCategoriesLoading(true)

        getCategoriesByClassificationId(value.clasificacionId).then((data) => {
          const transformedData = data.map((category) => ({
            value: category.id,
            label: category.nombre,
          }))
          setCategories(transformedData)
        })
        setValue('categoriaId', undefined)
        setIsCategoriesLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue])

  return {
    categories: {
      data: categories,
      isLoading: isCategoriesLoading,
    },

    classifications: {
      data: classifications,
      isLoading: isClassificationsLoading,
    },

    packagingUnits: {
      data: packagingUnits,
      isLoading: isPackagingUnitsLoading,
    },
  }
}

export default useItemCreationData
