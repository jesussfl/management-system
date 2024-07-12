'use client'
import { Switch } from '@/modules/common/components/switch/switch'
import { useEffect, useState, useTransition } from 'react'
import { switchShowCredentialsRecord } from '../lib/actions'
import { FormDescription, FormLabel } from '@/modules/common/components/form'
import { checkIfShowCredentialsEnabled } from '@/app/(attendance)/asistencias/lib/actions'
export default function SwitchShowCredentials() {
  const [showCredentials, setShowCredentials] = useState(false)
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    startTransition(() => {
      checkIfShowCredentialsEnabled().then((value) => {
        setShowCredentials(value ? true : false)
      })
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-md text-foreground font-bold">
          Mostrar credenciales al registrar asistencias
        </p>
        <p className="text-xs text-slate-500">
          Esta opción muestra los campos de correo electrónico y contraseña para
          los usuarios en el apartado de asistencias
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-foreground">No</p>
        <Switch
          disabled={isPending}
          checked={showCredentials}
          onCheckedChange={(value) => {
            if (value) {
              setShowCredentials(true)
              switchShowCredentialsRecord(true)
            } else {
              setShowCredentials(false)
              switchShowCredentialsRecord(false)
            }
          }}
        />

        <p className="text-foreground">Si</p>
      </div>
    </div>
  )
}
