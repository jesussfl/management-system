import { Prisma } from '@prisma/client'

export type SideMenuItem = {
  title: string
  path: string
  icon?: any
  submenu?: boolean
  submenuItems?: SideMenuItem[]
}

export type Renglon = {
  id: number
  nombre: string
  descripcion: string
  clasificacion: 'Consumible' | 'Equipo' | 'Insumo' | 'Material' | 'Mueble'
  categoria: string
  tipo: string
  presentacion: string
  numero_parte: string
  unidad_de_medida: string
}
export type RenglonType = Prisma.RenglonGetPayload<{
  include: {
    recepciones: {
      include: {
        seriales: true
      }
    }
    despachos: {
      include: {
        seriales: true
      }
    }

    unidad_empaque: true
  }
}>

export type DestinatarioType = Prisma.DestinatarioGetPayload<{
  include: {
    unidad: true
    despachos: true
    categoria: true
    componente: true
    grado: true
  }
}>
