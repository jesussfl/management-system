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
    path: '/dashboard/abastecimiento',
    icon: (color = '#666', size = 20) => <Package size={size} color={color} />,
    submenu: true,
    submenuItems: [
      {
        title: 'Inventario',
        path: '/dashboard/abastecimiento/inventario',
        icon: (color = '#666', size = 20) => (
          <Boxes size={size} color={color} />
        ),
      },
      {
        title: 'Recibimientos',
        path: '/dashboard/abastecimiento/recibimientos',
        icon: (color = '#666', size = 20) => (
          <PackagePlus size={size} color={color} />
        ),
      },
      {
        title: 'Despachos',
        path: '/dashboard/abastecimiento/despachos',
        icon: (color = '#666', size = 20) => (
          <PackageMinus size={size} color={color} />
        ),
      },
      {
        title: 'Almacenes',
        path: '/dashboard/abastecimiento/almacenes',
        icon: (color = '#666', size = 20) => (
          <Warehouse size={size} color={color} />
        ),
      },
      {
        title: 'Destinatarios',
        path: '/dashboard/abastecimiento/destinatarios',
        icon: (color = '#666', size = 20) => (
          <UserSquare2 size={size} color={color} />
        ),
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/armamento',
    icon: (color = '#666', size = 20) => <Bomb size={size} color={color} />,
  },
  {
    title: 'Personal',
    path: '/dashboard/personal',
    icon: (color = '#666', size = 20) => <Users2 size={size} color={color} />,
    submenu: true,
    submenuItems: [
      {
        title: 'Asistencias',
        path: '/dashboard/personal/asistencias',
        icon: (color = '#666', size = 20) => (
          <Contact2 size={size} color={color} />
        ),
      },
    ],
  },
  {
    title: 'Estadísticas',
    path: '/dashboard/estadisticas',
    icon: (color = '#666', size = 20) => <PieChart size={size} color={color} />,
  },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: (color = '#666', size = 20) => (
      <FolderSearch size={size} color={color} />
    ),
  },
  {
    title: 'Reportes',
    path: '/dashboard/reportes',
    icon: (color = '#666', size = 20) => <FileText size={size} color={color} />,
  },
  {
    title: 'Configuraciones',
    path: '/dashboard/configuracion',
    icon: (color = '#666', size = 20) => <Settings size={size} color={color} />,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    icon: (color = '#666', size = 20) => (
      <HelpCircle size={size} color={color} />
    ),
  },
]
