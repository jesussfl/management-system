export interface Section {
  id: number
  titulo: string
  permisos: string[]
  nombreSeccion: string
}
export const SECTION_NAMES_FOR_ROLES: Section[] = [
  {
    id: 1,
    titulo: 'Inventario de Abastecimiento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'INVENTARIO_ABASTECIMIENTO',
  },
  {
    id: 2,
    titulo: 'Pedidos de Abastecimiento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'PEDIDOS_ABASTECIMIENTO',
  },
  {
    id: 3,
    titulo: 'Recepciones de Abastecimiento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'RECEPCIONES_ABASTECIMIENTO',
  },
  {
    id: 4,
    titulo: 'Despachos de Abastecimiento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'DESPACHOS_ABASTECIMIENTO',
  },
  {
    id: 5,
    titulo: 'Devoluciones de Abastecimiento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'DEVOLUCIONES_ABASTECIMIENTO',
  },
  {
    id: 6,
    titulo: 'Destinatarios de Abastecimiento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'DESTINATARIOS_ABASTECIMIENTO',
  },
  {
    id: 7,
    titulo: 'Armas',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'ARMAS_ARMAMENTO',
  },
  {
    id: 9,
    titulo: 'Inventario de Armamento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'INVENTARIO_ARMAMENTO',
  },
  {
    id: 9,
    titulo: 'Pedidos de Armamento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'PEDIDOS_ARMAMENTO',
  },
  {
    id: 10,
    titulo: 'Recepciones de Armamento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'RECEPCIONES_ARMAMENTO',
  },
  {
    id: 11,
    titulo: 'Despachos de Armamento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'DESPACHOS_ARMAMENTO',
  },
  {
    id: 12,
    titulo: 'Devoluciones de Armamento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'DEVOLUCIONES_ARMAMENTO',
  },
  {
    id: 13,
    titulo: 'Destinatarios de Armamento',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'DESTINATARIOS_ARMAMENTO',
  },
  {
    id: 14,
    titulo: 'Profesionales',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'PROFESIONALES',
  },
  {
    id: 15,
    titulo: 'Almacenes',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'ALMACENES',
  },
  {
    id: 16,
    titulo: 'Personal',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'PERSONAL',
  },
  {
    id: 17,
    titulo: 'Usuarios',
    permisos: ['CREAR', 'ACTUALIZAR'],
    nombreSeccion: 'USUARIOS',
  },
  {
    id: 18,
    titulo: 'Auditoría',
    permisos: ['AUDITAR'],
    nombreSeccion: 'AUDITORIA',
  },
  {
    id: 19,
    titulo: 'Guardias',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'GUARDIAS',
  },

  {
    id: 21,
    titulo: 'Unidades',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'UNIDADES',
  },

  {
    id: 22,
    titulo: 'Asistencias',
    permisos: ['VISUALIZAR'],
    nombreSeccion: 'ASISTENCIAS',
  },

  {
    id: 23,
    titulo: 'Rangos',
    permisos: ['CREAR', 'ELIMINAR', 'ACTUALIZAR'],
    nombreSeccion: 'RANGOS',
  },
  {
    id: 24,
    titulo: 'Respaldo',
    permisos: ['CREAR', 'RESTAURAR'],
    nombreSeccion: 'RESPALDO',
  },
]
