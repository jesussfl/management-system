import { Option } from '@/modules/common/components/multiple-selector'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { Categoria_Militar, Grado_Militar, Prisma, Rol } from '@prisma/client'

export type SideMenuItem = {
  title: string
  identifier: SECTION_NAMES
  path: string
  icon?: any
  submenu?: boolean
  submenuItems?: SideMenuItem[]
  requiredPermissions?: string[]
}

export type RenglonWithAllRelations = Prisma.RenglonGetPayload<{
  include: {
    // recepciones: {
    //   include: {
    //     recepcion: true
    //     seriales: true
    //   }
    // }
    // despachos: {
    //   include: {
    //     despacho: true
    //     seriales: true
    //   }
    // }
    // devoluciones: {
    //   include: {
    //     devolucion: true
    //     seriales: true
    //   }
    // }
    clasificacion: true
    categoria: true

    subsistema: true
    almacen: true
    unidad_empaque: true

    seriales: true
  }
}>
export type RenglonColumns = {
  id: number
  nombre: string
  descripcion: string
  imagen?: string | null

  stock_minimo: number
  stock_maximo?: number
  stock: number
  seriales?: string

  numero_parte?: string
  peso_total: number

  estado: string

  unidad_empaque: string
  clasificacion: string
  categoria: string
  tipo?: string

  almacen: string

  subsistema?: string
  ubicacion?: string
  creado: Date
  editado: Date
}
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
export type ProfesionalType = Prisma.Profesional_AbastecimientoGetPayload<{
  include: {
    unidad: true
    categoria: true
    componente: true
    grado: true
    abastecedor: true
    supervisor: true
    autorizador: true
  }
}>
export type PersonalType = Prisma.PersonalGetPayload<{
  include: {
    unidad: true
    categoria: true
    componente: true
    grado: true
    usuario: true
  }
}>
export type GradosWithComponentes = Prisma.Grado_MilitarGetPayload<{
  include: {
    componentes: true
  }
}>

export type CategoriasWithGradosArray = Categoria_Militar & {
  grados: Option[]
}
export type GradosWithComponentesArray = Grado_Militar & {
  componentes: Option[]
}

export type RolesWithPermissionsArray = Rol & {
  permisos: Option[]
}

export type CreateCategoriasWithGrados = Omit<
  Categoria_Militar & { grados: { id_grado: number }[] },
  'id'
>
export type CreateGradosWithComponentes = Omit<
  Grado_Militar & {
    componentes: { id_componente: number }[]
  },
  'id'
>
export type CreateRolesWithPermissions = Omit<
  Rol & { permisos: string[] },
  'id'
>
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

export type SerialWithRenglon = Prisma.SerialGetPayload<{
  include: {
    renglon: true
  }
}>

export type UnidadesType = Prisma.Unidad_MilitarGetPayload<{
  include: {
    zodi: true
  }
}>

export type ZodiType = Prisma.ZodiGetPayload<{
  include: {
    redi: true
  }
}>
