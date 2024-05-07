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
  ABASTECIMIENTO = 'ABASTECIMIENTO',
  INVENTARIO = 'INVENTARIO',
  RECEPCION = 'RECEPCION',
  DESPACHOS = 'DESPACHOS',
  DEVOLUCIONES = 'DEVOLUCIONES',
  PROFESIONALES = 'PROFESIONALES',
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
  ASISTENCIAS = 'ASISTENCIAS',
  RECURSOS_HUMANOS = 'RECURSOS_HUMANOS',
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
    requiredPermissions: [SECTION_NAMES.ABASTECIMIENTO, SECTION_NAMES.TODAS],
    submenuItems: [
      {
        title: 'Inventario',
        path: '/dashboard/abastecimiento/inventario',
        icon: Boxes,
        requiredPermissions: [
          SECTION_NAMES.INVENTARIO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Recepciones',
        path: '/dashboard/abastecimiento/recepciones',
        icon: PackagePlus,
        requiredPermissions: [
          SECTION_NAMES.RECEPCION,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Despachos',
        path: '/dashboard/abastecimiento/despachos',
        icon: PackageMinus,
        requiredPermissions: [
          SECTION_NAMES.DESPACHOS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Devoluciones',
        path: '/dashboard/abastecimiento/devoluciones',
        icon: IterationCcw,
        requiredPermissions: [
          SECTION_NAMES.DEVOLUCIONES,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Almacenes',
        path: '/dashboard/abastecimiento/almacenes',
        icon: Warehouse,
        requiredPermissions: [
          SECTION_NAMES.ALMACENES,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Destinatarios',
        path: '/dashboard/abastecimiento/destinatarios',
        icon: UserSquare2,
        requiredPermissions: [
          SECTION_NAMES.DESTINATARIOS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Profesionales',
        path: '/dashboard/abastecimiento/profesionales',
        icon: Contact2,
        requiredPermissions: [
          SECTION_NAMES.PROFESIONALES,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
    ],
  },
  {
    title: 'Armamento',
    path: '/dashboard/armamento',
    icon: Bomb,
    requiredPermissions: [SECTION_NAMES.ARMAMENTO, SECTION_NAMES.TODAS],
    submenu: true,
    submenuItems: [
      {
        title: 'Inventario',
        path: '/dashboard/armamento/inventario',
        icon: Boxes,
        requiredPermissions: [
          SECTION_NAMES.INVENTARIO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Armas',
        path: '/dashboard/armamento/armas',
        icon: Bomb,
        requiredPermissions: [SECTION_NAMES.ARMAMENTO, SECTION_NAMES.TODAS],
      },
    ],
  },
  {
    title: 'Recursos Humanos',
    path: '/dashboard/recursos-humanos',
    icon: Users2,
    submenu: true,
    requiredPermissions: [SECTION_NAMES.RECURSOS_HUMANOS, SECTION_NAMES.TODAS],
    submenuItems: [
      {
        title: 'Personal',
        path: '/dashboard/recursos-humanos/personal',
        icon: Users2,
        requiredPermissions: [SECTION_NAMES.PERSONAL, SECTION_NAMES.TODAS],
      },
      {
        title: 'Asistencias',
        path: '/dashboard/recursos-humanos/asistencias',
        icon: Contact2,
        requiredPermissions: [SECTION_NAMES.ASISTENCIAS, SECTION_NAMES.TODAS],
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
    requiredPermissions: [SECTION_NAMES.USUARIOS, SECTION_NAMES.TODAS],
  },

  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: FolderSearch,
    requiredPermissions: [SECTION_NAMES.AUDITORIA, SECTION_NAMES.TODAS],
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
    requiredPermissions: [SECTION_NAMES.AYUDA, SECTION_NAMES.TODAS],
  },
]
