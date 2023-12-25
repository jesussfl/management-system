import {
  Home,
  Package,
  Box,
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

const DEFAULT_ICON_SIZE = 20
const DEFAULT_ICON_COLOR = '#666'

export const SIDE_NAV_ITEMS: SideNavItem[] = [
  {
    title: 'Inicio',
    path: '/dashboard',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <Home size={size} color={color} />
    ),
  },
  {
    title: 'Abastecimiento',
    path: '/dashboard/abastecimiento',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <Package size={size} color={color} />
    ),
    submenu: true,
    submenuItems: [
      {
        title: 'Inventario',
        path: '/dashboard/abastecimiento/inventario',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <Boxes size={size} color={color} />
        ),
      },

      {
        title: 'Renglones',
        path: '/dashboard/abastecimiento/renglones',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <Box size={size} color={color} />
        ),
      },
      {
        title: 'Recibimientos',
        path: '/dashboard/abastecimiento/recibimientos',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <PackagePlus size={size} color={color} />
        ),
      },
      {
        title: 'Despachos',
        path: '/dashboard/abastecimiento/despachos',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <PackageMinus size={size} color={color} />
        ),
      },
      {
        title: 'Almacenes',
        path: '/dashboard/abastecimiento/almacenes',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <Warehouse size={size} color={color} />
        ),
      },
      {
        title: 'Destinatarios',
        path: '/dashboard/abastecimiento/destinatarios',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <UserSquare2 size={size} color={color} />
        ),
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/armamento',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <Bomb size={size} color={color} />
    ),
  },
  {
    title: 'Personal',
    path: '/dashboard/personal',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <Users2 size={size} color={color} />
    ),
    submenu: true,
    submenuItems: [
      {
        title: 'Asistencias',
        path: '/dashboard/personal/asistencias',
        icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
          <Contact2 size={size} color={color} />
        ),
      },
    ],
  },
  {
    title: 'Estadísticas',
    path: '/dashboard/estadisticas',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <PieChart size={size} color={color} />
    ),
  },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <FolderSearch size={size} color={color} />
    ),
  },
  {
    title: 'Reportes',
    path: '/dashboard/reportes',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <FileText size={size} color={color} />
    ),
  },
  {
    title: 'Configuraciones',
    path: '/dashboard/configuracion',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <Settings size={size} color={color} />
    ),
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    icon: (color = DEFAULT_ICON_COLOR, size = DEFAULT_ICON_SIZE) => (
      <HelpCircle size={size} color={color} />
    ),
  },
]
