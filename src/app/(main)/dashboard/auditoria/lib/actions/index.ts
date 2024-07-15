'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { Acciones_Cortas } from '@prisma/client'

export const getAllAuditItems = async () => {
  const session = await auth()

  if (!session?.user) {
    revalidatePath('/')
  }

  const auditItems = await prisma.auditoria.findMany({
    orderBy: {
      fecha_realizado: 'desc',
    },
    include: {
      usuario: true,
    },
  })

  return auditItems
}

export const getAllAuditItemsByUser = async (userId: string) => {
  const session = await auth()

  if (!session?.user) {
    revalidatePath('/')
  }

  if (!userId) {
    return []
  }

  const auditItems = await prisma.auditoria.findMany({
    orderBy: {
      fecha_realizado: 'desc',
    },
    where: {
      id_usuario: userId,
    },
    include: {
      usuario: true,
    },
  })

  return auditItems
}

export const generateAuditReportData = async (
  userId: string,
  dateRange: DateRange,
  shortAction: Acciones_Cortas
) => {
  const session = await auth()
  if (!session?.user) {
    revalidatePath('/')
  }

  const auditItems = await prisma.auditoria.findMany({
    orderBy: {
      fecha_realizado: 'desc',
    },
    where: {
      id_usuario: userId,
      fecha_realizado: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
      accion_corta: shortAction,
    },
    include: {
      usuario: true,
    },
  })
  return {
    fecha_actual: new Date().getDate(),
    mes_actual: new Date().getMonth() + 1,
    anio_actual: new Date().getFullYear(),
    fecha_inicio: format(dateRange.from || new Date(), 'dd-MM-yyyy'),
    fecha_final: format(dateRange.to || new Date(), 'dd-MM-yyyy'),
    auditItems: auditItems.map((auditItem) => ({
      ...auditItem,
      fecha_realizado: format(
        auditItem?.fecha_realizado || new Date(),
        'dd-MM-yyyy HH:mm:ss'
      ),
    })),
  }
}
