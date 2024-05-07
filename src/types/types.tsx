import { Option } from '@/modules/common/components/multiple-selector'
import { Categoria_Militar, Grado_Militar, Prisma, Rol } from '@prisma/client'

export type SideMenuItem = {
  title: string
  path: string
  icon?: any
  submenu?: boolean
  submenuItems?: SideMenuItem[]
  requiredPermissions?: string[]
}

export type RenglonWithAllRelations = Prisma.RenglonGetPayload<{
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
    devoluciones: {
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
  Rol & { permisos: { permiso_key: string }[] },
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
