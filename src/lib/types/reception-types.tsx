import { Prisma } from '@prisma/client'

export interface ReceptionFormValues {
  fecha_recepcion: Date
  motivo?: string | null
  cedula_destinatario: string
  cedula_autorizador: string
  cedula_abastecedor: string
  cedula_supervisor?: string | null
  motivo_fecha?: string | null
  renglones: Recepcion_RenglonesFormValues[]
}
export interface Recepcion_RenglonesFormValues {
  id_renglon: number
  cantidad: number
  observacion?: string | null
  es_recepcion_liquidos: boolean
  seriales_automaticos: boolean
  seriales: {
    serial: string
    id_renglon: number
    condicion: string
    id?: number | null
    peso_actual?: number | null
  }[]

  fabricante?: string | null

  codigo_solicitud?: number | null
  fecha_fabricacion?: Date | null
  fecha_vencimiento?: Date | null
  precio?: number | null
}

export type RecepcionType = Prisma.RecepcionGetPayload<{
  include: {
    destinatario: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    supervisor: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    abastecedor: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    autorizador: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    renglones: { include: { renglon: true } }
  }
}>
