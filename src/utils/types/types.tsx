export type SideNavItem = {
  title: string
  path: string
  icon?: (color: string, size: number) => JSX.Element | null
  submenu?: boolean
  submenuItems?: SideNavItem[]
}
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export type Renglon = {
  id: number
  nombre: string
  descripcion: string
  clasificacion: string
  categoria: string
  tipo: string
  presentacion: string
  numero_parte: string
  unidad_de_medida: string
}
