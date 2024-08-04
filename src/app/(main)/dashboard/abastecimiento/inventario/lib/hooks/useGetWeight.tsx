import { getPackagingUnitById } from '@/lib/actions/packaging-units'
import { Medidas } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

const useGetWeight = () => {
  const { watch, setValue } = useFormContext()
  const [weight, setWeight] = useState(0)
  const [abreviation, setAbreviation] = useState('')
  const [measureType, setMeasureType] = useState<Medidas | null>(null)
  const packagingUnitId = watch('unidadEmpaqueId')

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) =>
  //     console.log(value, name, type)
  //   )
  //   return () => subscription.unsubscribe()
  // }, [watch])

  useEffect(() => {
    if (!packagingUnitId) return
    getPackagingUnitById(packagingUnitId).then((data) => {
      setWeight(Number(data.peso) || 0)
      setAbreviation(data.abreviacion || '')
      setMeasureType(data.tipo_medida)
      setValue('peso', data.peso, { shouldDirty: true })
      setValue('tipo_medida_unidad', data.tipo_medida, {
        shouldDirty: true,
      })
    })
  }, [packagingUnitId, setValue])

  return { weight, abreviation, measureType }
}

export default useGetWeight
