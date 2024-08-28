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
  Shield,
  FileBoxIcon,
} from 'lucide-react'
import { SideMenuItem } from '@/types/types'

export enum Abreviations {
  MILILITROS = 'ML',
  LITROS = 'LTS',
  ONZAS = 'ONZ',
  LIBRAS = 'LB',
  TONELADAS = 'TON',
  KILOGRAMOS = 'KG',
  GRAMOS = 'G',
  UNIDADES = 'UN',
}

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
  INVENTARIO_ABASTECIMIENTO = 'INVENTARIO_ABASTECIMIENTO',
  PEDIDOS_ABASTECIMIENTO = 'PEDIDOS_ABASTECIMIENTO',
  RECEPCIONES_ABASTECIMIENTO = 'RECEPCION_ABASTECIMIENTO',
  DESPACHOS_ABASTECIMIENTO = 'DESPACHOS_ABASTECIMIENTO',
  DEVOLUCIONES_ABASTECIMIENTO = 'DEVOLUCIONES_ABASTECIMIENTO',
  DESTINATARIOS_ABASTECIMIENTO = 'DESTINATARIOS_ABASTECIMIENTO',
  PRESTAMOS_ABASTECIMIENTO = 'PRESTAMOS_ABASTECIMIENTO',
  ARMAMENTO = 'ARMAMENTO',
  ARMAS_ARMAMENTO = 'ARMAS_ARMAMENTO',
  INVENTARIO_ARMAMENTO = 'INVENTARIO_ARMAMENTO',
  PEDIDOS_ARMAMENTO = 'PEDIDOS_ARMAMENTO',
  RECEPCIONES_ARMAMENTO = 'RECEPCIONES_ARMAMENTO',
  DESPACHOS_ARMAMENTO = 'DESPACHOS_ARMAMENTO',
  DEVOLUCIONES_ARMAMENTO = 'DEVOLUCIONES_ARMAMENTO',
  DESTINATARIOS_ARMAMENTO = 'DESTINATARIOS_ARMAMENTO',

  PROFESIONALES = 'PROFESIONALES',
  ALMACENES = 'ALMACENES',

  PERSONAL = 'PERSONAL',
  USUARIOS = 'USUARIOS',

  AUDITORIA = 'AUDITORIA',
  GUARDIAS = 'GUARDIAS',
  CONFIGURACION = 'CONFIGURACION',
  UNIDADES = 'UNIDADES',
  AYUDA = 'AYUDA',
  TODAS = 'TODAS',
  ASISTENCIAS = 'ASISTENCIAS',
  RECURSOS_HUMANOS = 'RECURSOS_HUMANOS',
  RANGOS = 'RANGOS',
  RESPALDO = 'RESPALDO',
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
        identifier: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/inventario',
        icon: Boxes,
        requiredPermissions: [
          SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Pedidos',
        identifier: SECTION_NAMES.PEDIDOS_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/pedidos',
        icon: PackagePlus,
        requiredPermissions: [
          SECTION_NAMES.PEDIDOS_ABASTECIMIENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Recepciones',
        identifier: SECTION_NAMES.RECEPCIONES_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/recepciones',
        icon: PackageCheck,
        requiredPermissions: [
          SECTION_NAMES.RECEPCIONES_ABASTECIMIENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Despachos',
        identifier: SECTION_NAMES.DESPACHOS_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/despachos',
        icon: PackageMinus,
        requiredPermissions: [
          SECTION_NAMES.DESPACHOS_ABASTECIMIENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Devoluciones',
        identifier: SECTION_NAMES.DEVOLUCIONES_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/devoluciones',
        icon: IterationCcw,
        requiredPermissions: [
          SECTION_NAMES.DEVOLUCIONES_ABASTECIMIENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Prestamos',
        identifier: SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/prestamos',
        icon: FileBoxIcon,
        requiredPermissions: [
          SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
        ],
      },
      {
        title: 'Destinatarios',
        identifier: SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
        path: '/dashboard/abastecimiento/destinatarios',
        icon: UserSquare2,
        requiredPermissions: [
          SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
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
        identifier: SECTION_NAMES.INVENTARIO_ARMAMENTO,
        path: '/dashboard/armamento/inventario',
        icon: Boxes,
        requiredPermissions: [
          SECTION_NAMES.INVENTARIO_ARMAMENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Armas',
        identifier: SECTION_NAMES.ARMAS_ARMAMENTO,
        path: '/dashboard/armamento/armas',
        icon: Bomb,
        requiredPermissions: [
          SECTION_NAMES.ARMAS_ARMAMENTO,
          SECTION_NAMES.TODAS,
        ],
      },
      {
        title: 'Pedidos',
        identifier: SECTION_NAMES.PEDIDOS_ARMAMENTO,
        path: '/dashboard/armamento/pedidos',
        icon: PackagePlus,
        requiredPermissions: [
          SECTION_NAMES.PEDIDOS_ARMAMENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Recepciones',
        identifier: SECTION_NAMES.RECEPCIONES_ARMAMENTO,
        path: '/dashboard/armamento/recepciones',
        icon: PackageCheck,
        requiredPermissions: [
          SECTION_NAMES.RECEPCIONES_ARMAMENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Despachos',
        identifier: SECTION_NAMES.DESPACHOS_ARMAMENTO,
        path: '/dashboard/armamento/despachos',
        icon: PackageMinus,
        requiredPermissions: [
          SECTION_NAMES.DESPACHOS_ARMAMENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Devoluciones',
        identifier: SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
        path: '/dashboard/armamento/devoluciones',
        icon: IterationCcw,
        requiredPermissions: [
          SECTION_NAMES.DEVOLUCIONES_ARMAMENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ARMAMENTO,
        ],
      },
      {
        title: 'Destinatarios',
        identifier: SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
        path: '/dashboard/armamento/destinatarios',
        icon: UserSquare2,
        requiredPermissions: [
          SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.ABASTECIMIENTO,
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
    submenuItems: [
      {
        title: 'Personal',
        identifier: SECTION_NAMES.PERSONAL,
        path: '/dashboard/recursos-humanos/personal',
        icon: Users2,
        requiredPermissions: [
          SECTION_NAMES.PERSONAL,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.RECURSOS_HUMANOS,
        ],
      },
      {
        title: 'Asistencias',
        identifier: SECTION_NAMES.ASISTENCIAS,
        path: '/dashboard/recursos-humanos/asistencias',
        icon: Contact2,
        requiredPermissions: [
          SECTION_NAMES.ASISTENCIAS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.RECURSOS_HUMANOS,
        ],
      },
      {
        title: 'Guardias',
        identifier: SECTION_NAMES.GUARDIAS,
        path: '/dashboard/recursos-humanos/guardias',
        icon: Contact2,
        requiredPermissions: [
          SECTION_NAMES.GUARDIAS,
          SECTION_NAMES.TODAS,
          SECTION_NAMES.RECURSOS_HUMANOS,
        ],
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
    icon: Shield,
    requiredPermissions: [
      SECTION_NAMES.TODAS,
      SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
      SECTION_NAMES.DESTINATARIOS_ARMAMENTO,
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
    requiredPermissions: [
      SECTION_NAMES.UNIDADES,
      SECTION_NAMES.TODAS,
      SECTION_NAMES.ABASTECIMIENTO,
      SECTION_NAMES.RECURSOS_HUMANOS,
      SECTION_NAMES.ARMAMENTO,
    ],
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
    identifier: SECTION_NAMES.RESPALDO,
    path: '/dashboard/configuracion',
    icon: DatabaseBackup,
    requiredPermissions: [SECTION_NAMES.RESPALDO, SECTION_NAMES.TODAS],
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    identifier: SECTION_NAMES.AYUDA,
    icon: HelpCircle,
  },
]
