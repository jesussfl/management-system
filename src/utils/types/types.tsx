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
