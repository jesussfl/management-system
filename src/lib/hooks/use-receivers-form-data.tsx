import { useEffect, useState } from 'react'
import {
  getAllComponents,
  getCategoriesByGradeId,
  getGradesByComponentId,
} from '../../app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/ranks'
import { ComboboxData } from '@/types/types'
import { useFormContext } from 'react-hook-form'

export const useReceiversFormData = () => {
  const { watch, setValue } = useFormContext()
  const [categories, setCategories] = useState<ComboboxData[]>([])
  const [components, setComponents] = useState<ComboboxData[]>([])
  const [grades, setGrades] = useState<ComboboxData[]>([])

  const [isCategoriesLoading, setCategoriesLoading] = useState(false)
  const [isComponentsLoading, setComponentsLoading] = useState(false)
  const [isGradesLoading, setGradesLoading] = useState(false)
  const componentId = watch('id_componente')
  const gradeId = watch('id_grado')

  //This effect is used to get all the components
  useEffect(() => {
    setComponentsLoading(true)
    setCategoriesLoading(true)
    setGradesLoading(true)

    getAllComponents().then((data) => {
      const transformedData = data.map((component) => ({
        value: component.id,
        label: component.nombre,
      }))

      setComponents(transformedData)
    })

    componentId &&
      getGradesByComponentId(componentId).then((data) => {
        const transformedData = data.map((grade) => ({
          value: grade.id,
          label: grade.nombre,
        }))

        setGrades(transformedData)
      })

    gradeId &&
      getCategoriesByGradeId(gradeId).then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))

        setCategories(transformedData)
      })

    setGradesLoading(false)
    setCategoriesLoading(false)
    setComponentsLoading(false)
  }, [])

  //This effect is used to get the grades and categories based on the selected component
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      //If the component is selected, get the grades related to it
      if (name === 'id_componente') {
        setGradesLoading(true)

        getGradesByComponentId(value.id_componente).then((data) => {
          const transformedData = data.map((grade) => ({
            value: grade.id,
            label: grade.nombre,
          }))

          setGrades(transformedData)

          setGradesLoading(false)
        })

        setValue('id_grado', null) //Reset the grade when the component changes
        setValue('id_categoria', null) //Reset the category when the component changes
      }

      //If the grade is selected, get the categories related to it
      if (name === 'id_grado' && value.id_grado) {
        setCategoriesLoading(true)

        getCategoriesByGradeId(value.id_grado).then((data) => {
          const transformedData = data.map((category) => ({
            value: category.id,
            label: category.nombre,
          }))

          setCategories(transformedData)

          setCategoriesLoading(false)
        })

        setValue('id_categoria', null) //Reset the category when the grade changes
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue])

  return {
    categories: {
      data: categories,
      isLoading: isCategoriesLoading,
    },
    components: {
      data: components,
      isLoading: isComponentsLoading,
    },
    grades: { data: grades, isLoading: isGradesLoading },
  }
}
