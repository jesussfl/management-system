import { getPackagingUnitById } from '@/lib/actions/packaging-units'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

const useGetWeight = () => {
  const { watch, setValue } = useFormContext()
  const [weight, setWeight] = useState(0)
  const [abreviation, setAbreviation] = useState('')
  const packagingUnitId = watch('unidadEmpaqueId')

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    )
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if (!packagingUnitId) return
    getPackagingUnitById(packagingUnitId).then((data) => {
      setWeight(Number(data.peso) || 0)
      setAbreviation(data.abreviacion || '')
      setValue('peso', data.peso)
    })
  }, [packagingUnitId, setValue])

  return { weight, abreviation }
}

export default useGetWeight
