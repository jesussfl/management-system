'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { registerAuditAction } from '@/lib/actions/audit'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import getGuideCode from '@/utils/helpers/get-guide-code'
import { format } from 'date-fns'
import { LoanFormValues, SelectedSerialForLoan } from '@/lib/types/loan-types'
import { Estados_Prestamos } from '@prisma/client'

export const createLoan = async (
  data: LoanFormValues,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { motivo, fecha_prestamo, cedula_destinatario, renglones } = data

  if (!fecha_prestamo || !renglones) {
    return {
      error: 'Missing Fields',
      success: false,
    }
  }

  if (renglones.length === 0) {
    return {
      error: 'No se han seleccionado renglones',
      success: false,
    }
  }
  if (
    renglones.some(
      (renglon) => renglon.seriales.length === 0 && renglon.manualSelection
    )
  ) {
    const fields = renglones
      .filter(
        (renglon) => renglon.seriales.length === 0 && renglon.manualSelection
      )
      .map((renglon) => renglon.id_renglon)

    return {
      error: 'Revisa que todos los renglones esten correctamente',
      success: false,

      fields: fields,
    }
  }

  const items = data.renglones
  const serials: SelectedSerialForLoan[] = []
  for (const item of items) {
    console.log(item)
    if (item.manualSelection) {
      const serialsByItem = item.seriales.map((serial) => ({
        id_renglon: item.id_renglon,
        serial: serial.serial,
        id: 0,
        peso_despachado: 0,
        peso_actual: 0,
      }))
      serials.push(...serialsByItem)

      continue
    }
    const serialsByItem = await prisma.serial.findMany({
      where: {
        id_renglon: item.id_renglon,
        AND: {
          estado: {
            in: ['Disponible', 'Devuelto'],
          },
        },
      },
      select: {
        id_renglon: true,
        renglon: true,
        serial: true,
      },
      take: item.cantidad,
    })
    console.log(serialsByItem.length, item.cantidad, item.id_renglon)
    if (serialsByItem.length < item.cantidad) {
      return {
        error:
          'No hay suficientes seriales en el renglon' +
          item.id_renglon +
          ' ' +
          ' Cantidad a despachar:' +
          item.cantidad,
        success: false,

        fields: [item.id_renglon],
      }
    }

    serials.push(
      ...serialsByItem.map((serial) => ({
        id_renglon: item.id_renglon,
        serial: serial.serial,
        id: 0,
        peso_despachado: 0,
        peso_actual: 0,
      }))
    )
  }
  await prisma.$transaction(async (prisma) => {
    const loan = await prisma.prestamo.create({
      data: {
        servicio,
        cedula_destinatario,
        cedula_abastecedor: data.cedula_abastecedor,
        cedula_supervisor: data.cedula_supervisor || undefined,
        cedula_autorizador: data.cedula_autorizador,
        motivo,
        estado: 'Prestado',
        fecha_prestamo,
        motivo_fecha: data.motivo_fecha || undefined,
        renglones: {
          create: renglones.map((renglon) => ({
            manualSelection: renglon.manualSelection,

            observacion: renglon.observacion,
            id_renglon: renglon.id_renglon,
            cantidad: serials.filter(
              (serial) => serial.id_renglon === renglon.id_renglon
            ).length,
            prestamos_Seriales: undefined,
            seriales: {
              connect: serials
                .filter((serial) => serial.id_renglon === renglon.id_renglon)
                .map((serial) => ({ serial: serial.serial })),
            },
          })),
        },
      },
    })

    await prisma.serial.updateMany({
      where: {
        serial: {
          in: serials.map((serial) => serial.serial),
        },
      },
      data: {
        estado: 'Prestado',
      },
    })
    const loanedItems = data.renglones

    loanedItems.forEach(async (item) => {
      await prisma.renglon.update({
        where: {
          id: item.id_renglon,
        },
        data: {
          stock_actual: {
            decrement: item.manualSelection
              ? item.seriales.length
              : item.cantidad,
          },
        },
      })
    })

    await registerAuditAction(
      'CREAR',
      `Se realizó un prestamo en ${servicio.toLowerCase()} con el siguiente motivo: ${motivo}. El id del prestamo es: ${
        loan.id
      }  ${
        data.motivo_fecha
          ? `, la fecha de creación fue: ${format(
              loan.fecha_creacion,
              'yyyy-MM-dd HH:mm'
            )}, la fecha de prestamo: ${format(
              loan.fecha_prestamo,
              'yyyy-MM-dd HH:mm'
            )}, motivo de la fecha: ${data.motivo_fecha}`
          : ''
      }`
    )
  })

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/prestamos`)

  return {
    success: true,
    error: false,
  }
}
export const updateLoanStatus = async (
  id: number,
  data: {
    estado: Estados_Prestamos | null | undefined
  },
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const loan = await prisma.prestamo.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          renglon: true,
          seriales: true,
        },
      },
    },
  })

  if (!loan) {
    return {
      error: 'El pedido no existe',
      success: false,
    }
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.prestamo.update({
      where: {
        id,
      },
      data: {
        estado: data.estado,
      },
    })
    const loanedItems = loan.renglones

    const serials: SelectedSerialForLoan[] = []
    for (const item of loanedItems) {
      console.log(item)
      if (item.manualSelection) {
        const serialsByItem = item.seriales.map((serial) => ({
          id_renglon: item.id_renglon,
          serial: serial.serial,
          id: 0,
          peso_despachado: 0,
          peso_actual: 0,
        }))
        serials.push(...serialsByItem)
        continue
      }
      const serialsByItem = await prisma.serial.findMany({
        where: {
          id_renglon: item.id_renglon,
          AND: {
            estado: {
              in: ['Prestado'],
            },
          },
        },
        select: {
          id_renglon: true,
          renglon: true,
          serial: true,
        },
        take: item.cantidad,
      })
      console.log(serialsByItem.length, item.cantidad, item.id_renglon)
      if (serialsByItem.length < item.cantidad) {
        return {
          error:
            'No hay suficientes seriales en el renglon' +
            item.id_renglon +
            ' ' +
            ' Cantidad a despachar:' +
            item.cantidad,
          success: false,

          fields: [item.id_renglon],
        }
      }

      serials.push(
        ...serialsByItem.map((serial) => ({
          id_renglon: item.id_renglon,
          serial: serial.serial,
          id: 0,
          peso_despachado: 0,
          peso_actual: 0,
        }))
      )
    }

    loanedItems.forEach((renglon) => {
      // @ts-ignore
      delete renglon.id
    })

    loanedItems.forEach(async (item) => {
      switch (data.estado) {
        case 'Devuelto':
          await prisma.renglon.update({
            where: {
              id: item.id_renglon,
            },
            data: {
              stock_actual: {
                increment: item.manualSelection
                  ? item.seriales.length
                  : item.cantidad,
              },
            },
          })
          await prisma.serial.updateMany({
            where: {
              serial: {
                in: serials.map((serial) => serial.serial),
              },
            },
            data: {
              estado: 'Disponible',
            },
          })
          break
        case 'Prestado':
          await prisma.renglon.update({
            where: {
              id: item.id_renglon,
            },
            data: {
              stock_actual: {
                decrement: item.manualSelection
                  ? item.seriales.length
                  : item.cantidad,
              },
            },
          })
          await prisma.serial.updateMany({
            where: {
              serial: {
                in: serials.map((serial) => serial.serial),
              },
            },
            data: {
              estado: 'Prestado',
            },
          })
          break
      }
    })

    await registerAuditAction(
      'ACTUALIZAR',
      `Se actualizó el estado del préstamo de ${servicio.toLowerCase()} con el id: ${id} a: ${
        data.estado
      }`
    )
  })

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/prestamos`)

  return {
    success: 'Recepcion actualizada exitosamente',
    error: false,
  }
}
export const updateLoan = async (
  id: number,
  data: LoanFormValues,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { motivo, fecha_prestamo, cedula_destinatario, renglones } = data

  if (!fecha_prestamo || !renglones) {
    return {
      error: 'Missing Fields',
      success: false,
    }
  }

  if (renglones.length === 0) {
    return {
      error: 'No se han seleccionado renglones',
      success: false,
    }
  }
  if (
    renglones.some(
      (renglon) => renglon.seriales.length === 0 && renglon.manualSelection
    )
  ) {
    const fields = renglones
      .filter(
        (renglon) => renglon.seriales.length === 0 && renglon.manualSelection
      )
      .map((renglon) => renglon.id_renglon)

    return {
      error: 'Revisa que todos los renglones esten correctamente',
      success: false,

      fields: fields,
    }
  }

  const items = data.renglones

  const serials: SelectedSerialForLoan[] = []
  for (const item of items) {
    console.log(item)
    if (item.manualSelection) {
      const serialsByItem = item.seriales.map((serial) => ({
        id_renglon: item.id_renglon,
        serial: serial.serial,
        id: 0,
        peso_despachado: 0,
        peso_actual: 0,
      }))
      serials.push(...serialsByItem)
      continue
    }
    const serialsByItem = await prisma.serial.findMany({
      where: {
        id_renglon: item.id_renglon,
        AND: {
          estado: {
            in: ['Despachado'],
          },
        },
      },
      select: {
        id_renglon: true,
        renglon: true,
        serial: true,
      },
      take: item.cantidad,
    })
    console.log(serialsByItem.length, item.cantidad, item.id_renglon)
    if (serialsByItem.length < item.cantidad) {
      return {
        error:
          'No hay suficientes seriales en el renglon' +
          item.id_renglon +
          ' ' +
          ' Cantidad a despachar:' +
          item.cantidad,
        success: false,

        fields: [item.id_renglon],
      }
    }

    serials.push(
      ...serialsByItem.map((serial) => ({
        id_renglon: item.id_renglon,
        serial: serial.serial,
        id: 0,
        peso_despachado: 0,
        peso_actual: 0,
      }))
    )
  }

  renglones.forEach((renglon) => {
    // @ts-ignore
    delete renglon.id
  })

  const loan = await prisma.prestamo.update({
    where: {
      id,
    },
    data: {
      cedula_destinatario,
      cedula_abastecedor: data.cedula_abastecedor,
      cedula_supervisor: data?.cedula_supervisor || null,
      cedula_autorizador: data.cedula_autorizador,
      motivo,
      fecha_prestamo,
      motivo_fecha: data.motivo_fecha || null,
    },
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó el prestamo en ${servicio.toLowerCase()} con el id ${id} ${
      data.motivo_fecha
        ? `, la fecha de creación fue: ${format(
            loan.fecha_creacion,
            'dd-MM-yyyy HH:mm'
          )}, fecha de prestamo: ${format(
            loan.fecha_prestamo,
            'dd-MM-yyyy HH:mm'
          )}, motivo de la fecha: ${data.motivo_fecha}`
        : ''
    }`
  )

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/prestamos`)

  return {
    success: true,
    error: false,
  }
}
export const deleteLoan = async (
  id: number,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const loan = await prisma.prestamo.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          renglon: true,
          seriales: true,
        },
      },
    },
  })

  if (!loan) {
    return {
      error: 'Despacho no existe',
      success: false,
    }
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.prestamo.delete({
      where: {
        id: id,
      },
    })

    await prisma.serial.updateMany({
      where: {
        id_renglon: {
          in: loan.renglones.flatMap((renglon) =>
            renglon.seriales.map((serial) => serial.id_renglon)
          ),
        },
      },
      data: {
        estado: 'Disponible',
      },
    })
    const loanedItems = loan.renglones

    loanedItems.forEach(async (item) => {
      await prisma.renglon.update({
        where: {
          id: item.id_renglon,
        },
        data: {
          stock_actual: {
            decrement: item.seriales.length,
          },
        },
      })
    })
    await registerAuditAction(
      'ELIMINAR',
      `Se eliminó el prestamo en ${servicio.toLowerCase()} con el id: ${id}`
    )
  })
  revalidatePath(`/dashboard/${servicio.toLowerCase()}/prestamos`)

  return {
    success: 'Despacho eliminado exitosamente',
    error: false,
  }
}
export const recoverLoan = async (
  id: number,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const loan = await prisma.prestamo.findUnique({
    where: {
      id,
    },
    include: {
      renglones: {
        include: {
          seriales: true,
        },
      },
    },
  })

  if (!loan) {
    return {
      error: 'Despacho no existe',
      success: false,
    }
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.prestamo.update({
      where: {
        id: id,
      },
      data: {
        fecha_eliminacion: null,
      },
    })

    await prisma.serial.updateMany({
      where: {
        id_renglon: {
          in: loan.renglones.flatMap((renglon) =>
            renglon.seriales.map((serial) => serial.id_renglon)
          ),
        },
      },
      data: {
        estado: 'Despachado',
      },
    })

    const loanedItems = loan.renglones

    loanedItems.forEach(async (item) => {
      await prisma.renglon.update({
        where: {
          id: item.id_renglon,
        },
        data: {
          stock_actual: {
            increment: item.seriales.length,
          },
        },
      })
    })

    await registerAuditAction(
      'RECUPERAR',
      `Se recuperó el prestamo en ${servicio.toLowerCase()} con el id: ${id}`
    )
  })

  revalidatePath(`/dashboard/${servicio.toLowerCase()}/prestamos`)

  return {
    success: 'Despacho recuperado exitosamente',
    error: false,
  }
}
export const getAllLoans = async (servicio: 'Abastecimiento' | 'Armamento') => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const loan = await prisma.prestamo.findMany({
    orderBy: {
      ultima_actualizacion: 'desc',
    },
    where: {
      servicio,
    },
    include: {
      renglones: {
        include: {
          renglon: {
            include: {
              unidad_empaque: true,
            },
          },
          seriales: true,
        },
      },
      destinatario: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      supervisor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      abastecedor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      autorizador: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
    },
  })
  return loan
}

export const getLoanById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const loan = await prisma.prestamo.findUnique({
    where: {
      id,
    },
    include: {
      destinatario: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      supervisor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      abastecedor: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      autorizador: {
        include: {
          grado: true,
          categoria: true,
          componente: true,
          unidad: true,
        },
      },
      renglones: {
        include: {
          prestamos_Seriales: {
            include: {
              serial: true,
            },
          },
          renglon: {
            include: {
              unidad_empaque: true,
              recepciones: true,
              clasificacion: true,
              prestamos: {
                include: {
                  seriales: true,
                },
              },
            },
          },
          seriales: {
            select: {
              serial: true,
              id_renglon: true,
              condicion: true,
              peso_actual: true,
            },
          },
        },
      },
    },
  })

  if (!loan) {
    throw new Error('Despacho no existe')
  }

  return {
    ...loan,

    renglones: loan.renglones.map((renglon) => ({
      ...renglon,
      seriales: renglon.seriales.map((serial) => {
        return {
          id: 0,
          peso_despachado: 0,
          serial: serial.serial,
          id_renglon: renglon.id_renglon,
          peso_actual: 0,
        }
      }),
    })),
  }
}

export const getLoanForExportGuide = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const loanData = await getLoanById(id)

  if (!loanData) {
    throw new Error('Despacho no existe')
  }

  return {
    destinatario_cedula: `${loanData.destinatario.tipo_cedula}-${loanData.cedula_destinatario}`,
    destinatario_nombres: loanData.destinatario.nombres,
    destinatario_apellidos: loanData.destinatario.apellidos,
    destinatario_grado: loanData?.destinatario?.grado?.nombre || 's/c',
    destinatario_cargo: loanData.destinatario.cargo_profesional || 's/c',
    destinatario_telefono: loanData.destinatario.telefono,
    prestamo: loanData,
    renglones: loanData.renglones.map((renglon) => ({
      ...renglon,
      cantidad: renglon.seriales.length,
      seriales: renglon.seriales.map((serial) => serial.serial),
    })),
    autorizador: loanData.autorizador,
    abastecedor: loanData.abastecedor,
    supervisor: loanData.supervisor,
    unidad: loanData?.destinatario?.unidad?.nombre.toUpperCase() || 's/u',
    codigo: getGuideCode(loanData.id),
    motivo: loanData.motivo || 's/m',
  }
}

export const deleteMultipleLoans = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.prestamo.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado prestamos en abastecimiento con los siguientes ids: ${ids}`
  )
  revalidatePath('/dashboard/abastecimiento/prestamos')

  return {
    success: 'Se han eliminado los prestamos correctamente',
    error: false,
  }
}

export const getAllLoansByItemId = async (
  itemId: number,
  servicio: 'Abastecimiento' | 'Armamento'
) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const orders = await prisma.pedido.findMany({
    where: {
      fecha_eliminacion: null,
      servicio,
      renglones: {
        some: {
          id_renglon: itemId,
        },
      },
    },
  })
  return orders
}
