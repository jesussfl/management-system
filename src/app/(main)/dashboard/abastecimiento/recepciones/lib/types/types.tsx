import { SelectedSerial } from '@/app/(main)/dashboard/components/forms/reception-form/serial-selector'

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
  seriales:
    | {
        id: undefined
        serial: string
        id_renglon: number
        condicion?: string | null
        peso_recibido?: undefined
      }[]
    | SelectedSerial[]
  fabricante?: string | null

  codigo_solicitud?: number | null
  fecha_fabricacion?: Date | null
  fecha_vencimiento?: Date | null
  precio?: number | null
}
