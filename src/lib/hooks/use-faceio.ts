import { useTransition, useState, useEffect, useRef } from 'react'

// @ts-ignore
import faceIO from '@faceio/fiojs'
import { errorMessages, fioErrCode } from '@/utils/constants/fio-errors'

export const useFaceio = () => {
  const faceioRef = useRef<faceIO | null>(null)

  const initialiseFaceio = async () => {
    try {
      faceioRef.current = new faceIO(process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID)
      console.log('FaceIO initialized successfully')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    initialiseFaceio()
  }, [])

  return { faceioRef }
}
