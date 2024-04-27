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
  LocateIcon,
  IterationCcw,
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

export enum SECTION_NAMES {
  INICIO = 'INICIO',
  INVENTARIO = 'INVENTARIO',
  RECEPCION = 'RECEPCION',
  DESPACHOS = 'DESPACHOS',
  DEVOLUCIONES = 'DEVOLUCIONES',
  Profesionales = 'PROFESIONALES',
  ALMACENES = 'ALMACENES',
  DESTINATARIOS = 'DESTINATARIOS',
  ARMAMENTO = 'ARMAMENTO',
  PERSONAL = 'PERSONAL',
  USUARIOS = 'USUARIOS',
  ESTADISTICAS = 'ESTADISTICAS',
  AUDITORIA = 'AUDITORIA',
  REPORTES = 'REPORTES',
  CONFIGURACION = 'CONFIGURACION',
  UNIDADES = 'UNIDADES',
  AYUDA = 'AYUDA',
  TODAS = 'TODAS',
}

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
    requiredPermissions: [SECTION_NAMES.INVENTARIO, SECTION_NAMES.TODAS],
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
        title: 'Devoluciones',
        path: '/dashboard/abastecimiento/devoluciones',
        icon: IterationCcw,
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
      {
        title: 'Profesionales',
        path: '/dashboard/abastecimiento/profesionales',
        icon: Contact2,
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/armamento',
    icon: Bomb,
    requiredPermissions: [SECTION_NAMES.ARMAMENTO, SECTION_NAMES.TODAS],
  },
  {
    title: 'Personal',
    path: '/dashboard/personal',
    icon: Users2,
    submenu: true,
    requiredPermissions: [SECTION_NAMES.PERSONAL, SECTION_NAMES.TODAS],
    submenuItems: [
      {
        title: 'Asistencias',
        path: '/dashboard/personal/asistencias',
        icon: Contact2,
      },
    ],
  },
  {
    title: 'Unidades',
    path: '/dashboard/unidades',
    icon: LocateIcon,
    requiredPermissions: [SECTION_NAMES.UNIDADES, SECTION_NAMES.TODAS],
  },
  {
    title: 'Usuarios',
    path: '/dashboard/usuarios',
    icon: UserCircle,
    // requiredPermissions: [SECTION_NAMES.USUARIOS, SECTION_NAMES.TODAS],
  },
  // {
  //   title: 'Estadísticas',
  //   path: '/dashboard/estadisticas',
  //   icon: PieChart,
  //   requiredPermissions: [SECTION_NAMES.ESTADISTICAS],
  // },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: FolderSearch,
    requiredPermissions: [SECTION_NAMES.AUDITORIA, SECTION_NAMES.TODAS],
  },
  // {
  //   title: 'Reportes',
  //   path: '/dashboard/reportes',
  //   icon: FileText,
  //   requiredPermissions: [SECTION_NAMES.REPORTES, SECTION_NAMES.TODAS],
  // },
  {
    title: 'Configuraciones',
    path: '/dashboard/configuracion',
    icon: Settings,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    icon: HelpCircle,
    requiredPermissions: [SECTION_NAMES.AYUDA, SECTION_NAMES.TODAS],
  },
]
