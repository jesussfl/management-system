export interface ReturnFormValues {
  fecha_devolucion: Date
  motivo: string
  cedula_destinatario: string
  cedula_autorizador: string
  cedula_abastecedor: string
  cedula_supervisor?: string | null
  motivo_fecha?: string | null
  renglones: Devolucion_RenglonesFormValues[]
}
export interface Devolucion_RenglonesFormValues {
  id_renglon: number
  observacion?: string | null
  seriales: string[]
}
