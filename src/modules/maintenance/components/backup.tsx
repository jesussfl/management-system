'use client'
import { backup, restore } from '@/app/(main)/dashboard/lib/actions/admin'
import { Button } from '@/modules/common/components/button'

function BackupButton() {
  const handleBackup = async () => {
    backup()
  }

  const handleRestore = async () => {
    restore()
  }
  return (
    <>
      <Button variant="default" size={'sm'} onClick={handleBackup}>
        Generar Backup
      </Button>
      <Button variant="default" size={'sm'} onClick={handleRestore}>
        Restaurar
      </Button>
    </>
  )
}

export default BackupButton
