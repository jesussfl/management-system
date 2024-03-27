import { getCategoriesByClassificationId } from '@/lib/actions/categories'
import { getAllClassifications } from '@/lib/actions/classifications'
import { getPackagingUnitsByCategoryId } from '@/lib/actions/packaging-units'
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
  const [packagingUnitsData, setPackagingUnitsData] = useState<UnidadEmpaque[]>(
    []
  )
  const [isPackagingUnitsLoading, setIsPackagingUnitsLoading] = useState(false)
  const [isClassificationsLoading, setIsClassificationsLoading] =
    useState(false)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)

  const id_categoria = watch('categoriaId')
  const id_clasificacion = watch('clasificacionId')

  useEffect(() => {
    setIsClassificationsLoading(true)

    getAllClassifications().then((data) => {
      const transformedData = data.map((classification) => ({
        value: classification.id,
        label: classification.nombre,
      }))
      setClassifications(transformedData)
      setIsClassificationsLoading(false)
    })
  }, [])

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    )
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    setIsCategoriesLoading(true)

    getCategoriesByClassificationId(id_clasificacion)
      .then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))
        setCategories(transformedData)
      })
      .catch((error) => {
        console.log(error)
      })
    setValue('categoriaId', undefined)
    setValue('unidadEmpaqueId', undefined)
    setIsCategoriesLoading(false)
  }, [id_clasificacion, setValue])

  useEffect(() => {
    setIsPackagingUnitsLoading(true)

    getPackagingUnitsByCategoryId(id_categoria)
      .then((data) => {
        const transformedData = data.map((packagingUnit) => ({
          value: packagingUnit.id,
          label: packagingUnit.nombre,
        }))
        setPackagingUnits(transformedData)
        setPackagingUnitsData(data)
      })
      .catch((error) => {
        console.log(error)
      })
    setValue('unidadEmpaqueId', undefined)

    setIsPackagingUnitsLoading(false)
  }, [id_categoria, setValue])

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
      packagingUnitsData: packagingUnitsData,
    },
  }
}

export default useItemCreationData
