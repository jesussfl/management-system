'use client'
import { backup, restore } from '@/lib/actions/admin'
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
import { useToast } from '@/modules/common/components/toast/use-toast'
function BackupButton() {
  const [isLoading, setIsloading] = useState(false)
  const [fileNameToRestore, setFileNameToRestore] = useState('')
  const { toast } = useToast()
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
    const res = await restore(fileNameToRestore)

    if (res) {
      toast({
        title: 'Copia de seguridad reestablecida',
        description: 'Se ha reestablecido la copia de seguridad',
        variant: 'success',
      })
    }

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
                'Crear Copia de Seguridad'
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
              datos del sistema. (Archivo .tar)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              className="py-0 mb-3"
              type="file"
              accept=".tar"
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
                'Restaurar Copia de Seguridad'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BackupButton
