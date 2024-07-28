export interface DispatchFormValues {
  fecha_despacho: Date
  motivo?: string | null
  cedula_destinatario: string
  cedula_autorizador: string
  cedula_abastecedor: string
  cedula_supervisor?: string | null
  motivo_fecha?: string | null
  renglones: Despacho_RenglonesFormValues[]
}
export interface Despacho_RenglonesFormValues {
  id_renglon: number
  cantidad: number
  manualSelection: boolean
  observacion?: string | null
  seriales: string[]
}
