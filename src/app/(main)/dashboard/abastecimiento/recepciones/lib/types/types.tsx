import { Serial } from '@prisma/client'

type SerialType = Omit<
  Serial,
  'id' | 'id_recepcion' | 'fecha_creacion' | 'ultima_actualizacion'
>
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
  seriales_automaticos: boolean
  seriales: {
    serial: string
    id_renglon: number
  }[]
  fabricante?: string | null

  codigo_solicitud?: number | null
  fecha_fabricacion?: Date | null
  fecha_vencimiento?: Date | null
  precio?: number | null
}
