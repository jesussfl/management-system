import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import {
  getAllCategories,
  getAllComponents,
  getAllGrades,
} from '../actions/ranks'
import { ComboboxData } from '@/types/types'

export const useReceiversFormData = () => {
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<ComboboxData[]>([])
  const [components, setComponents] = useState<ComboboxData[]>([])
  const [grades, setGrades] = useState<ComboboxData[]>([])

  const router = useRouter()

  useEffect(() => {
    startTransition(() => {
      getAllCategories().then((data) => {
        const transformedData = data.map((category) => ({
          value: category.id,
          label: category.nombre,
        }))
        setCategories(transformedData)
      })

      getAllComponents().then((data) => {
        const transformedData = data.map((component) => ({
          value: component.id,
          label: component.nombre,
        }))

        setComponents(transformedData)
      })

      getAllGrades().then((data) => {
        const transformedData = data.map((grade) => ({
          value: grade.id,
          label: grade.nombre,
        }))

        setGrades(transformedData)
      })
    })
  }, [])

  return { categories, components, grades, isPending, router, startTransition }
}
