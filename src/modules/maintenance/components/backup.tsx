'use client'
import { backup, restore } from '@/app/(main)/dashboard/lib/actions/admin'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import { DatabaseBackup, DatabaseZap, Loader2 } from 'lucide-react'
import { useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
function BackupButton() {
  const [isLoading, setIsloading] = useState(false)
  const [fileNameToRestore, setFileNameToRestore] = useState('')
  // console.log(fileNameToRestore, 'fileeee')
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
      <div className="flex w-full gap-4 justify-between">
        <Card className="flex-1">
          <CardHeader>
            <DatabaseZap className="h-8 w-8 text-green-600" />
            <CardTitle>Crear copia de seguridad</CardTitle>
            <CardDescription>
              Con esta opción puedes crear una copia de seguridad de todos los
              datos del sistema. Esta operación puede tardar varios minutos.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <DatabaseBackup className="h-8 w-8 text-green-600" />
            <CardTitle>Reestablecer copia de seguridad</CardTitle>
            <CardDescription>
              Selecciona una copia de seguridad para reestablecer la base de
              datos del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BackupButton
