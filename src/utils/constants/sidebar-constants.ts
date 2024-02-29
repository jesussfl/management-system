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
    icon: Home,
  },
  {
    title: 'Abastecimiento',
    path: '/dashboard/abastecimiento',
    icon: Package,
    submenu: true,
    submenuItems: [
      {
        title: 'Inventario',
        path: '/dashboard/abastecimiento/inventario',
        icon: Boxes,
      },
      {
        title: 'Recepciones',
        path: '/dashboard/abastecimiento/recepciones',
        icon: PackagePlus,
      },
      {
        title: 'Despachos',
        path: '/dashboard/abastecimiento/despachos',
        icon: PackageMinus,
      },
      {
        title: 'Almacenes',
        path: '/dashboard/abastecimiento/almacenes',
        icon: Warehouse,
      },
      {
        title: 'Destinatarios',
        path: '/dashboard/abastecimiento/destinatarios',
        icon: UserSquare2,
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/armamento',
    icon: Bomb,
  },
  {
    title: 'Personal',
    path: '/dashboard/personal',
    icon: Users2,
    submenu: true,
    submenuItems: [
      {
        title: 'Asistencias',
        path: '/dashboard/personal/asistencias',
        icon: Contact2,
      },
    ],
  },
  {
    title: 'Usuarios',
    path: '/dashboard/usuarios',
    icon: UserCircle,
  },
  {
    title: 'Estadísticas',
    path: '/dashboard/estadisticas',
    icon: PieChart,
  },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: FolderSearch,
  },
  {
    title: 'Reportes',
    path: '/dashboard/reportes',
    icon: FileText,
  },
  {
    title: 'Configuraciones',
    path: '/dashboard/configuracion',
    icon: Settings,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    icon: HelpCircle,
  },
]

export enum SECTION_NAMES {
  INICIO = 'INICIO',
  INVENTARIO = 'INVENTARIO',
  RECEPCION = 'RECEPCION',
  DESPACHOS = 'DESPACHOS',
  ALMACENES = 'ALMACENES',
  DESTINATARIOS = 'DESTINATARIOS',
  ARMAMENTO = 'ARMAMENTO',
  PERSONAL = 'PERSONAL',
  USUARIOS = 'USUARIOS',
  ESTADISTICAS = 'ESTADISTICAS',
  AUDITORIA = 'AUDITORIA',
  REPORTES = 'REPORTES',
  CONFIGURACION = 'CONFIGURACION',
  AYUDA = 'AYUDA',
  TODAS = 'TODAS',
}
