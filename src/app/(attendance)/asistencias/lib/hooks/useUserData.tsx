'use client'
import { useEffect, useState } from 'react'
import { getUserById } from '@/app/(main)/dashboard/usuarios/lib/actions/users'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'

type UserData = Prisma.UsuarioGetPayload<{
  include: {
    personal: {
      include: {
        guardias: true
      }
    }
  }
}>

export default function useUserData(userId: string) {
  const [user, setUser] = useState<UserData>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    getUserById(userId).then((user) => {
      setUser(user)
      setIsLoading(false)
    })
  }, [userId])
  // const user = getUserById(userId)

  if (!user || !user.personal || isLoading)
    return {
      error: 'No existe el usuario',
      dataToShow: null,
    }

  const personalData = user.personal
  const dataToShow = [
    {
      title: 'Nombre Completo',
      info: `${personalData.nombres} ${personalData.apellidos}`,
    },
    {
      title: 'Cédula',
      info: `${personalData.tipo_cedula}-${personalData.cedula}`,
    },
    {
      title: 'Próximas Guardias',
      info: `${user.personal.guardias
        .filter((guardia) => guardia.fecha > new Date())
        .map((guardia) => {
          return (
            format(new Date(guardia.fecha), 'dd/MM/yyyy') +
            ' ' +
            guardia.ubicacion
          )
        })
        .join(', ')}`,
    },
  ]
  return {
    error: null,
    dataToShow,
    isLoading,
  }
}
