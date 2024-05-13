import { getUserById } from '@/app/(main)/dashboard/usuarios/lib/actions/users'
import { format } from 'date-fns'

export default async function useUserData(userId: string) {
  const user = await getUserById(userId)

  if (!user || !user.personal)
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
  }
}
