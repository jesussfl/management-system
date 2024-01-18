import { useTransition, useState, useEffect } from 'react'

// @ts-ignore
import faceIO from '@faceio/fiojs'

export const useFaceio = () => {
  const [faceio, setFaceio] = useState<any>(null)

  useEffect(() => {
    const initializeFaceIO = async () => {
      try {
        // Create a new instance of FaceIO with your public ID
        const faceioInstance = new faceIO(
          process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID
        )
        // Update state with the instance
        setFaceio(faceioInstance)
      } catch (error) {
        // Set error state if initialization fails
      }
    }
    initializeFaceIO()
  }, [])

  return { faceio }
}
