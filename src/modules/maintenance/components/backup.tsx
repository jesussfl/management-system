'use client'
import { backup, restore } from '@/app/(main)/dashboard/lib/actions/admin'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

function BackupButton() {
  const [isLoading, setIsloading] = useState(false)
  const [fileNameToRestore, setFileNameToRestore] = useState('')
  console.log(fileNameToRestore, 'fileeee')
  const handleBackup = async () => {
    setIsloading(true)
    const fileName = await backup()

    const file = await fetch('/backups/' + fileName)

    const blob = await file.blob() // Convertir la respuesta en un blob

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName // Nombre de archivo de descarga
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    setIsloading(false)
  }

  const handleRestore = async () => {
    setIsloading(true)
    await restore(fileNameToRestore)
    setIsloading(false)
  }
  return (
    <>
      <Button
        variant="default"
        size={'sm'}
        onClick={handleBackup}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Crear Backup'
        )}
      </Button>
      <Input
        type="file"
        onChange={(e) => {
          // @ts-ignore
          setFileNameToRestore(e.target.files[0].name || '')
        }}
      />
      <Button
        variant="default"
        size={'sm'}
        onClick={handleRestore}
        disabled={!fileNameToRestore || isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Restaurar'
        )}
      </Button>
    </>
  )
}

export default BackupButton
