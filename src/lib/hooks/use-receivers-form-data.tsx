import { useEffect, useState } from 'react'
import {
  getAllComponents,
  getCategoriesByGradeId,
  getGradesByComponentId,
} from '../../app/(main)/dashboard/rangos/lib/actions/ranks'
import { ComboboxData } from '@/types/types'
import { useFormContext } from 'react-hook-form'
import { getAllUnits } from '@/app/(main)/dashboard/unidades/lib/actions/units'

export const useReceiversFormData = () => {
  const { watch, setValue } = useFormContext()
  const [categories, setCategories] = useState<ComboboxData[]>([])
  const [components, setComponents] = useState<ComboboxData[]>([])
  const [grades, setGrades] = useState<ComboboxData[]>([])
  const [units, setUnits] = useState<ComboboxData[]>([])
  const [isCategoriesLoading, setCategoriesLoading] = useState(false)
  const [isComponentsLoading, setComponentsLoading] = useState(false)
  const [isGradesLoading, setGradesLoading] = useState(false)
  const [isUnitsLoading, setUnitsLoading] = useState(false)
  const componentId = watch('id_componente')
  const gradeId = watch('id_grado')

  //This effect is used to get all the components
  useEffect(() => {
    setComponentsLoading(true)
    setCategoriesLoading(true)
    setGradesLoading(true)
    setUnitsLoading(true)

    getAllComponents().then((data) => {
      const transformedData = data.map((component) => ({
        value: component.id,
        label: component.nombre,
      }))

      setComponents(transformedData)
    })

    componentId &&
      getGradesByComponentId(componentId).then((data) => {
        const sortedData = data.sort((a, b) => {
          // Manejar el caso de que 'orden' sea null en 'a' o 'b'
          if (a.orden === null && b.orden === null) {
            return 0 // Si ambos son null, considerarlos iguales
          }
          if (a.orden === null) {
            return 1 // Si 'orden' de 'a' es null, colocar 'a' después de 'b'
          }
          if (b.orden === null) {
            return -1 // Si 'orden' de 'b' es null, colocar 'b' después de 'a'
          }
          // Si ambos tienen valores en 'orden', comparar normalmente
          return a.orden - b.orden
        })

        const transformedData = sortedData.map((grade) => ({
          value: grade.id,
          label: `${grade.nombre} - ${grade.orden}`,
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

    getAllUnits().then((data) => {
      const transformedData = data.map((unit) => ({
        value: unit.id,
        label: unit.nombre,
      }))
      setUnits(transformedData)
    })
    setGradesLoading(false)
    setCategoriesLoading(false)
    setComponentsLoading(false)
    setUnitsLoading(false)
  }, [])

  //This effect is used to get the grades and categories based on the selected component
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      //If the component is selected, get the grades related to it
      if (name === 'id_componente') {
        setGradesLoading(true)

        getGradesByComponentId(value.id_componente).then((data) => {
          const sortedData = data.sort((a, b) => {
            // Manejar el caso de que 'orden' sea null en 'a' o 'b'
            if (a.orden === null && b.orden === null) {
              return 0 // Si ambos son null, considerarlos iguales
            }
            if (a.orden === null) {
              return 1 // Si 'orden' de 'a' es null, colocar 'a' después de 'b'
            }
            if (b.orden === null) {
              return -1 // Si 'orden' de 'b' es null, colocar 'b' después de 'a'
            }
            // Si ambos tienen valores en 'orden', comparar normalmente
            return a.orden - b.orden
          })

          const transformedData = sortedData.map((grade) => ({
            value: grade.id,
            label: `${grade.nombre} - ${grade.orden}`,
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
    units: { data: units, isLoading: isUnitsLoading },
  }
}
