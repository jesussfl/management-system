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
  UserCircle,
} from 'lucide-react'
import { SideMenuItem } from '@/types/types'

const DEFAULT_ICON_SIZE = 20

/**
 * Object array which represents the items in a side menu.
 * Each object in the array has properties such as title (the display name of the menu item), path (the URL path associated with the menu item),
 * and icon (the icon to display next to the menu item).
 * Some of the menu items also have a submenu property, indicating that they have sub-menu items.
 * The sub-menu items are defined in the submenuItems property, which is also an array of objects with similar properties.
 * 
 * @type {SideMenuItem[]}
 * @memberof SideMenuItem
 * @example
 * const sideMenuItems = [
 *   {
 *     title: 'Home',
 *     path: '/',
 *     icon: <Home size={DEFAULT_ICON_SIZE} />,
 *   },
 }
 ]
 */
export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  {
    title: 'Inicio',
    path: '/dashboard',
    icon: <Home size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Abastecimiento',
    path: '/dashboard/abastecimiento',
    icon: <Package size={DEFAULT_ICON_SIZE} />,
    submenu: true,
    submenuItems: [
      {
        title: 'Inventario',
        path: '/dashboard/abastecimiento/inventario',
        icon: <Boxes size={DEFAULT_ICON_SIZE} />,
      },

      // {
      //   title: 'Renglones',
      //   path: '/dashboard/abastecimiento/renglones',
      //   icon: <Box size={DEFAULT_ICON_SIZE} />,
      // },
      {
        title: 'Recibimientos',
        path: '/dashboard/abastecimiento/recibimientos',
        icon: <PackagePlus size={DEFAULT_ICON_SIZE} />,
      },
      {
        title: 'Despachos',
        path: '/dashboard/abastecimiento/despachos',
        icon: <PackageMinus size={DEFAULT_ICON_SIZE} />,
      },
      {
        title: 'Almacenes',
        path: '/dashboard/abastecimiento/almacenes',
        icon: <Warehouse size={DEFAULT_ICON_SIZE} />,
      },
      {
        title: 'Destinatarios',
        path: '/dashboard/abastecimiento/destinatarios',
        icon: <UserSquare2 size={DEFAULT_ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/armamento',
    icon: <Bomb size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Personal',
    path: '/dashboard/personal',
    icon: <Users2 size={DEFAULT_ICON_SIZE} />,
    submenu: true,
    submenuItems: [
      {
        title: 'Asistencias',
        path: '/dashboard/personal/asistencias',
        icon: <Contact2 size={DEFAULT_ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'Usuarios',
    path: '/dashboard/usuarios',
    icon: <UserCircle size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Estadísticas',
    path: '/dashboard/estadisticas',
    icon: <PieChart size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: <FolderSearch size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Reportes',
    path: '/dashboard/reportes',
    icon: <FileText size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Configuraciones',
    path: '/dashboard/configuracion',
    icon: <Settings size={DEFAULT_ICON_SIZE} />,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    icon: <HelpCircle size={DEFAULT_ICON_SIZE} />,
  },
]
