import { getCategoriesByClassificationId } from '@/lib/actions/categories'
import { getAllClassifications } from '@/lib/actions/classifications'
import { getPackagingUnitsByCategoryId } from '@/lib/actions/packaging-units'
import { UnidadEmpaque } from '@prisma/client'
import { useState, useEffect } from 'react'
type ComboboxData = {
  value: number
  label: string
}
const useItemCreationData = (form: any) => {
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

  const id_categoria = form.watch('categoriaId')
  const id_clasificacion = form.watch('clasificacionId')

  useEffect(() => {
    setIsCategoriesLoading(true)

    getCategoriesByClassificationId(id_clasificacion)
      .then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))
        setCategories(transformedData)
        setIsCategoriesLoading(false)
      })
      .catch((error) => {
        console.log(error)

        setIsCategoriesLoading(false)
      })
  }, [id_clasificacion])

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
        setIsPackagingUnitsLoading(false)
      })
      .catch((error) => {
        console.log(error)

        setIsPackagingUnitsLoading(false)
      })
  }, [id_categoria, form])

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
