'use client'
import { backup, restore } from '@/app/(main)/dashboard/lib/actions/admin'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

function BackupButton() {
  const { toast } = useToast()
  const [isLoading, setIsloading] = useState(false)
  const [fileNameToRestore, setFileNameToRestore] = useState('')
  console.log(fileNameToRestore, 'fileeee')
  const handleBackup = async () => {
    setIsloading(true)
    try {
      const apiUrl = '/api/export-backup'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(body),
      })

      if (!response.ok) {
        toast({
          title: 'Parece que hubo un problema',
          description: 'No se pudo generar el archivo',
          variant: 'destructive',
        })
        setIsloading(false)
        return
      }
      const fileName = 'database-backup-' + new Date().valueOf() + '.tar'
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      toast({
        title: 'Parece que hubo un problema',
        description: 'No se pudo generar el archivo: ' + error,
        variant: 'destructive',
      })
    } finally {
      setIsloading(false)
    }
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
