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
  id: string
  nombre: string
  descripcion: string
  tipo: string
  serial: string
  presentacion: string
  numero_parte: string
  estado: string
  existencia: number
  stock_minimo: number
  stock_maximo: number
  inventariable: boolean
  ubicacion: string
  id_almacen: number
}
