import { getUserById } from '@/app/(main)/dashboard/usuarios/lib/actions/users'

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
      title: 'Próxima Guardia',
      info: `PROXIMAMENTE...`,
    },
    {
      title: 'Ubicación de la Guardia',
      info: `PROXIMAMENTE...`,
    },
  ]
  return {
    error: null,
    dataToShow,
  }
}
