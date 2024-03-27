import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import {
  getAllCategories,
  getAllComponents,
  getAllGrades,
} from '../actions/ranks'
import { ComboboxData } from '@/types/types'
import { useFormContext } from 'react-hook-form'

export const useReceiversFormData = () => {
  const { watch } = useFormContext()
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<ComboboxData[]>([])
  const [components, setComponents] = useState<ComboboxData[]>([])
  const [grades, setGrades] = useState<ComboboxData[]>([])

  const router = useRouter()
  const id_componente = watch('id_componente')

  console.log(id_componente)
  // useEffect(() => {
  //   startTransition(() => {
  //     getAllCategories().then((data) => {
  //       const transformedData = data.map((category) => ({
  //         value: category.id,
  //         label: category.nombre,
  //       }))
  //       setCategories(transformedData)
  //     })

  //     getAllComponents().then((data) => {
  //       const transformedData = data.map((component) => ({
  //         value: component.id,
  //         label: component.nombre,
  //       }))

  //       setComponents(transformedData)
  //     })

  //     getAllGrades().then((data) => {
  //       const transformedData = data.map((grade) => ({
  //         value: grade.id,
  //         label: grade.nombre,
  //       }))

  //       setGrades(transformedData)
  //     })
  //   })
  // }, [])

  // useEffect(() => {}, [])

  return { categories, components, grades, isPending, router, startTransition }
}
