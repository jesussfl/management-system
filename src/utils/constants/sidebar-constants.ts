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
  PackageCheck,
  DatabaseBackup,
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
  PEDIDOS = 'PEDIDOS',
  RECEPCION = 'RECEPCION',
  DESPACHOS = 'DESPACHOS',
  DEVOLUCIONES = 'DEVOLUCIONES',
  DESTINATARIOS = 'DESTINATARIOS',

  PROFESIONALES = 'PROFESIONALES',
  ALMACENES = 'ALMACENES',

  ARMAMENTO = 'ARMAMENTO',

  PERSONAL = 'PERSONAL',
  USUARIOS = 'USUARIOS',

  AUDITORIA = 'AUDITORIA',

  CONFIGURACION = 'CONFIGURACION',
  UNIDADES = 'UNIDADES',
  AYUDA = 'AYUDA',
  TODAS = 'TODAS',
  ASISTENCIAS = 'ASISTENCIAS',
  RECURSOS_HUMANOS = 'RECURSOS_HUMANOS',
  RANGOS = 'RANGOS',
}

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  {
    title: 'Inicio',
    identifier: SECTION_NAMES.INICIO,
    path: '/dashboard',
    icon: Home,
  },
  {
    title: 'Abastecimiento',
    path: '/dashboard/abastecimiento',
    identifier: SECTION_NAMES.ABASTECIMIENTO,
    icon: Package,
    submenu: true,

    submenuItems: [
      {
        title: 'Inventario',
        identifier: SECTION_NAMES.INVENTARIO,
        path: '/dashboard/abastecimiento/inventario',
        icon: Boxes,
        requiredPermissions: [
          SECTION_NAMES.INVENTARIO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Pedidos',
        identifier: SECTION_NAMES.PEDIDOS,
        path: '/dashboard/abastecimiento/pedidos',
        icon: PackagePlus,
        requiredPermissions: [
          SECTION_NAMES.PEDIDOS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Recepciones',
        identifier: SECTION_NAMES.RECEPCION,
        path: '/dashboard/abastecimiento/recepciones',
        icon: PackageCheck,
        requiredPermissions: [
          SECTION_NAMES.RECEPCION,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Despachos',
        identifier: SECTION_NAMES.DESPACHOS,
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
        identifier: SECTION_NAMES.DEVOLUCIONES,
        path: '/dashboard/abastecimiento/devoluciones',
        icon: IterationCcw,
        requiredPermissions: [
          SECTION_NAMES.DEVOLUCIONES,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },

      {
        title: 'Destinatarios',
        identifier: SECTION_NAMES.DESTINATARIOS,
        path: '/dashboard/abastecimiento/destinatarios',
        icon: UserSquare2,
        requiredPermissions: [
          SECTION_NAMES.DESTINATARIOS,
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
    identifier: SECTION_NAMES.ARMAMENTO,
    submenu: true,
    submenuItems: [
      {
        title: 'Inventario',
        identifier: SECTION_NAMES.INVENTARIO,
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
        identifier: SECTION_NAMES.ARMAMENTO,
        path: '/dashboard/armamento/armas',
        icon: Bomb,
        requiredPermissions: [SECTION_NAMES.ARMAMENTO, SECTION_NAMES.TODAS],
      },
      {
        title: 'Pedidos',
        identifier: SECTION_NAMES.PEDIDOS,
        path: '/dashboard/armamento/pedidos',
        icon: PackagePlus,
        requiredPermissions: [
          SECTION_NAMES.PEDIDOS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Recepciones',
        identifier: SECTION_NAMES.RECEPCION,
        path: '/dashboard/armamento/recepciones',
        icon: PackageCheck,
        requiredPermissions: [
          SECTION_NAMES.RECEPCION,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Despachos',
        identifier: SECTION_NAMES.DESPACHOS,
        path: '/dashboard/armamento/despachos',
        icon: PackageMinus,
        requiredPermissions: [
          SECTION_NAMES.DESPACHOS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Devoluciones',
        identifier: SECTION_NAMES.DEVOLUCIONES,
        path: '/dashboard/armamento/devoluciones',
        icon: IterationCcw,
        requiredPermissions: [
          SECTION_NAMES.DEVOLUCIONES,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
    ],
  },

  {
    title: 'Recursos Humanos',
    path: '/dashboard/recursos-humanos',
    icon: Users2,
    identifier: SECTION_NAMES.RECURSOS_HUMANOS,
    submenu: true,
    requiredPermissions: [SECTION_NAMES.RECURSOS_HUMANOS, SECTION_NAMES.TODAS],
    submenuItems: [
      {
        title: 'Personal',
        identifier: SECTION_NAMES.PERSONAL,
        path: '/dashboard/recursos-humanos/personal',
        icon: Users2,
        requiredPermissions: [SECTION_NAMES.PERSONAL, SECTION_NAMES.TODAS],
      },
      {
        title: 'Asistencias',
        identifier: SECTION_NAMES.ASISTENCIAS,
        path: '/dashboard/recursos-humanos/asistencias',
        icon: Contact2,
        requiredPermissions: [SECTION_NAMES.ASISTENCIAS, SECTION_NAMES.TODAS],
      },
      {
        title: 'Guardias',
        identifier: SECTION_NAMES.ASISTENCIAS,
        path: '/dashboard/recursos-humanos/guardias',
        icon: Contact2,
        requiredPermissions: [SECTION_NAMES.ASISTENCIAS, SECTION_NAMES.TODAS],
      },
    ],
  },
  {
    title: 'Almacenes',
    identifier: SECTION_NAMES.ALMACENES,
    path: '/dashboard/almacenes',
    icon: Warehouse,
    requiredPermissions: [SECTION_NAMES.ALMACENES, SECTION_NAMES.TODAS],
  },
  {
    title: 'Rangos',
    identifier: SECTION_NAMES.RANGOS,
    path: '/dashboard/rangos',
    icon: Contact2,
    requiredPermissions: [
      SECTION_NAMES.TODAS,
      SECTION_NAMES.DESTINATARIOS,
      SECTION_NAMES.PROFESIONALES,
      SECTION_NAMES.RANGOS,
      SECTION_NAMES.ABASTECIMIENTO,
      SECTION_NAMES.RECURSOS_HUMANOS,
      SECTION_NAMES.ARMAMENTO,
    ],
  },
  {
    title: 'Profesionales',
    identifier: SECTION_NAMES.PROFESIONALES,
    path: '/dashboard/profesionales',
    icon: Contact2,
    requiredPermissions: [
      SECTION_NAMES.PROFESIONALES,
      SECTION_NAMES.TODAS,
      SECTION_NAMES.ABASTECIMIENTO,
      SECTION_NAMES.RECURSOS_HUMANOS,
      SECTION_NAMES.ARMAMENTO,
    ],
  },
  {
    title: 'Unidades',
    identifier: SECTION_NAMES.UNIDADES,
    path: '/dashboard/unidades',
    icon: LocateIcon,
    requiredPermissions: [SECTION_NAMES.UNIDADES, SECTION_NAMES.TODAS],
  },
  {
    title: 'Usuarios',
    identifier: SECTION_NAMES.USUARIOS,
    path: '/dashboard/usuarios',
    icon: UserCircle,
    requiredPermissions: [SECTION_NAMES.USUARIOS, SECTION_NAMES.TODAS],
  },

  {
    title: 'Auditoria',
    identifier: SECTION_NAMES.AUDITORIA,
    path: '/dashboard/auditoria',
    icon: FolderSearch,
    requiredPermissions: [SECTION_NAMES.AUDITORIA, SECTION_NAMES.TODAS],
  },

  {
    title: 'Respaldo',
    identifier: SECTION_NAMES.CONFIGURACION,
    path: '/dashboard/configuracion',
    icon: DatabaseBackup,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    identifier: SECTION_NAMES.AYUDA,
    icon: HelpCircle,
    requiredPermissions: [SECTION_NAMES.AYUDA, SECTION_NAMES.TODAS],
  },
]
