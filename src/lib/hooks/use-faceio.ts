import { useTransition, useState, useEffect, useRef } from 'react'

// @ts-ignore
import faceIO from '@faceio/fiojs'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'

export const useFaceio = () => {
  const [faceio, setFaceio] = useState<faceIO | null>(null)

  const initialiseFaceio = async () => {
    try {
      const faceioInstance = new faceIO(
        process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID
      )

      setFaceio(faceioInstance)
      console.log('FaceIO initialized successfully')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    initialiseFaceio()
  }, [])

  return { faceio }
}
