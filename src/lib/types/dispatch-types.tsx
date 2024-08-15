import { Prisma } from '@prisma/client'

export type DespachoType = Prisma.DespachoGetPayload<{
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
    renglones: { include: { renglon: true; seriales: true } }
  }
}>

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
  es_despacho_liquidos: boolean
  seriales: SelectedSerialForDispatch[]
}

export type SelectedSerialForDispatch = {
  id: number
  serial: string
  id_renglon: number
  peso_despachado: number
  peso_actual: number
}
