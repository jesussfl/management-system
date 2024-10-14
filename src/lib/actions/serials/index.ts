'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const getAllSerials = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.findMany()
  return serials
}

export const getSerialsByItem = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.findMany({
    where: {
      recepcion: {
        id_renglon: id,
      },
    },
  })

  return serials.map((serial) => serial.serial)
}

export const getAllSerialsByItemId = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.findMany({
    where: {
      renglon: {
        id,
        recepciones: {
          some: {
            recepcion: {
              fecha_eliminacion: {
                equals: null,
              },
            },
          },
        },
      },
    },
    include: {
      renglon: true,
    },
  })

  return serials
}

export const getSerialsByItemId = async (
  id: number,
  isEditEnabled?: boolean
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  if (isEditEnabled) {
    const serials = await prisma.serial.findMany({
      where: {
        renglon: {
          id,
        },

        AND: {
          estado: {
            in: ['Disponible', 'Despachado'],
          },
        },
      },
      include: {
        renglon: true,
      },
    })

    return serials
  }

  const serials = await prisma.serial.findMany({
    where: {
      renglon: {
        id,
      },

      AND: {
        estado: {
          in: ['Disponible', 'Devuelto'],
        },
      },
    },
    include: {
      renglon: true,
    },
  })

  return serials
}
export const getDispatchedSerialsByItemId = async (
  id: number,
  isEditEnabled?: boolean
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  if (isEditEnabled) {
    const serials = await prisma.serial.findMany({
      where: {
        renglon: {
          id,
        },

        AND: {
          estado: {
            in: ['Despachado', 'Devuelto'],
          },
        },
      },
      include: {
        renglon: true,
      },
    })

    return serials
  }
  const serials = await prisma.serial.findMany({
    where: {
      renglon: {
        id,
      },

      AND: {
        estado: 'Despachado',
      },
    },
    include: {
      renglon: true,
    },
  })

  return serials
}

export const getSerialsCountByItemId = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.count({
    where: {
      renglon: {
        id,
      },
      AND: {
        estado: {
          in: ['Disponible', 'Devuelto'],
        },
      },
    },
  })

  return serials
}

export const getSerialsByItemEnabled = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const serials = await prisma.serial.findMany({
    where: {
      renglon: {
        id,
      },
      AND: {
        estado: {
          in: ['Disponible', 'Devuelto'],
        },
      },
    },
    include: {
      renglon: true,
    },
  })

  return serials
}

export const checkSerialExistanceByItemId = async ({
  id,
  serial,
}: {
  id: number
  serial: string
}) => {
  try {
    await validateUserSessionV2()

    const existance = await prisma.serial.findFirst({
      where: {
        id_renglon: id,
        AND: {
          serial,
        },
      },
    })

    if (existance) {
      return true
    }

    return false
  } catch (error) {
    return false
  }
}
export const getTotalWeightByItemId = async (id: number) => {
  try {
    await validateUserSessionV2()

    const totalWeight = await prisma.serial.aggregate({
      _sum: {
        peso_actual: true,
      },
      where: {
        id_renglon: id,
        estado: {
          in: ['Disponible', 'Devuelto'],
        },
      },
    })

    return totalWeight._sum.peso_actual
  } catch (error) {
    return false
  }
}
export const validateUserSessionV2 = async () => {
  try {
    const session = await auth()

    if (!session?.user) {
      throw new Error('Necesitas iniciar sesión para realizar esta acción')
    }

    if (!session?.user.rol.permisos) {
      throw new Error('No tienes permisos para realizar esta acción')
    }
  } catch (error) {
    return catchError(error)
  }
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrio un error inesperado, por favor intenta de nuevo'
}

export const catchError = (error: unknown) => {
  return {
    data: null,
    error: getErrorMessage(error),
  }
}

// export const getAllItems = async ({
//   page = 1,
//   pageSize = 10,
//   onlyActives,
//   section,
// }: GetAllItemsProps) => {
//   const skip = (page - 1) * pageSize

//   try {
//     await validateUserSessionV2()
//     const total = await prisma.renglon.count({
//       where: {
//         fecha_eliminacion: onlyActives ? null : undefined,
//         servicio: section,
//       },
//     })
//     const renglones = await prisma.renglon.findMany({
//       skip,
//       take: pageSize,
//       orderBy: {
//         ultima_actualizacion: 'desc',
//       },
//       where: {
//         servicio: section,
//         fecha_eliminacion: onlyActives ? null : undefined,
//       },
//       include: {
//         clasificacion: true,
//         unidad_empaque: true,
//         almacen: true,
//         categoria: true,
//         subsistema: true,
//         seriales: true,
//       },
//     })

//     const noOfPages = Math.ceil(total / pageSize)
//     const returnedData = {
//       data: renglones,
//       total,
//       noOfPages,
//     }
//     return returnedData
//   } catch (error) {
//     return catchError(error)
//   }
// }
