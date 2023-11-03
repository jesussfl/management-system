import {
  Home,
  Package,
  Bomb,
  Users2,
  PieChart,
  Settings,
  Boxes,
  Warehouse,
  UserSquare2,
  Contact2,
  FolderSearch,
  FileText,
  PackagePlus,
  PackageMinus,
  HelpCircle,
} from 'lucide-react'
import { SideNavItem } from '@/utils/types/types'
export const SIDE_NAV_ITEMS: SideNavItem[] = [
  {
    title: 'Inicio',
    path: '/dashboard',
    icon: (color = '#666', size = 20) => <Home size={size} color={color} />,
  },
  {
    title: 'Abastecimiento',
    path: '/dashboard/supplies',
    icon: (color = '#666', size = 20) => <Package size={size} color={color} />,
    submenu: true,
    submenuItems: [
      {
        title: 'Renglones',
        path: '/dashboard/supplies/items',
        icon: (color = '#666', size = 20) => (
          <Boxes size={size} color={color} />
        ),
      },
      {
        title: 'Recibimientos',
        path: '/dashboard/supplies/entrances',
        icon: (color = '#666', size = 20) => (
          <PackagePlus size={size} color={color} />
        ),
      },
      {
        title: 'Despachos',
        path: '/dashboard/supplies/dispatches',
        icon: (color = '#666', size = 20) => (
          <PackageMinus size={size} color={color} />
        ),
      },
      {
        title: 'Almacenes',
        path: '/dashboard/supplies/deposits',
        icon: (color = '#666', size = 20) => (
          <Warehouse size={size} color={color} />
        ),
      },
      {
        title: 'Profesionales',
        path: '/dashboard/supplies/professionals',
        icon: (color = '#666', size = 20) => (
          <UserSquare2 size={size} color={color} />
        ),
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/weapons',
    icon: (color = '#666', size = 20) => <Bomb size={size} color={color} />,
  },
  {
    title: 'Personal',
    path: '/dashboard/personnel',
    icon: (color = '#666', size = 20) => <Users2 size={size} color={color} />,
    submenu: true,
    submenuItems: [
      {
        title: 'Asistencias',
        path: '/dashboard/personnel/attendances',
        icon: (color = '#666', size = 20) => (
          <Contact2 size={size} color={color} />
        ),
      },
    ],
  },
  {
    title: 'Estadísticas',
    path: '/dashboard/analytics',
    icon: (color = '#666', size = 20) => <PieChart size={size} color={color} />,
  },
  {
    title: 'Auditoria',
    path: '/dashboard/audit',
    icon: (color = '#666', size = 20) => (
      <FolderSearch size={size} color={color} />
    ),
  },
  {
    title: 'Reportes',
    path: '/dashboard/reports',
    icon: (color = '#666', size = 20) => <FileText size={size} color={color} />,
  },
  {
    title: 'Configuraciones',
    path: '/dashboard/settings',
    icon: (color = '#666', size = 20) => <Settings size={size} color={color} />,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/help',
    icon: (color = '#666', size = 20) => (
      <HelpCircle size={size} color={color} />
    ),
  },
]
