'use client'
import { useState } from 'react'

export function Upload() {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    setIsLoading(true)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      console.log('Upload successful:', data)

      // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito al usuario
    } catch (error) {
      console.error('Error uploading file:', error)

      // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div>
      <h1>Upload</h1>
      <input type="file" onChange={handleFileUpload} disabled={isLoading} />
      {isLoading && <p>Uploading...</p>}
    </div>
  )
}
