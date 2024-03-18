import { Prisma } from '@prisma/client'

export type SideMenuItem = {
  title: string
  path: string
  icon?: any
  submenu?: boolean
  submenuItems?: SideMenuItem[]
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
export type CategoriaType = Prisma.CategoriaGetPayload<{
  include: {
    clasificacion: true
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

export type GradosWithComponentes = Prisma.Grado_MilitarGetPayload<{
  include: {
    componentes: true
  }
}>
export type GradosWithComponentesAndIncludeComponente =
  Prisma.Grado_MilitarGetPayload<{
    include: { componentes: { include: { componente: true } } }
  }>
export type CheckboxDataType = {
  id: number
  label: string
}

export type ComboboxData = {
  value: number
  label: string
}
