import { RenglonWithAllRelations } from '@/types/types'
import { Serial } from '@prisma/client'
import { RenglonColumns } from '../../app/(main)/dashboard/armamento/inventario/(tabs)/@tabs/columns'

export const formatExcelData = (rowsData: any) => {
  const rows = rowsData.map((row: any) => {
    const cells = row.original as RenglonWithAllRelations
    const stock = cells.seriales.filter(
      (serial: Serial) =>
        serial.estado === 'Disponible' || serial.estado === 'Devuelto'
    ).length

    const seriales = cells.seriales
      .filter(
        (serial: Serial) =>
          serial.estado === 'Disponible' || serial.estado === 'Devuelto'
      )
      .map((serial: Serial) => serial.serial)
      .join(', ')

    const formattedData: RenglonColumns = {
      id: cells.id,
      nombre: cells.nombre,
      descripcion: cells.descripcion,
      imagen: cells.imagen,

      stock_minimo: cells.stock_minimo,
      stock_maximo: cells.stock_maximo || undefined,

      numero_parte: cells.numero_parte || 'Sin numero de parte',
      peso_total: cells.peso,
      estado: cells.estado || 'Sin estado',

      tipo: cells.tipo || undefined,

      clasificacion: cells.clasificacion.nombre,
      categoria: cells.categoria.nombre,
      unidad_empaque: cells.unidad_empaque.nombre,
      subsistema: cells.subsistema?.nombre || 'Sin subsistema',
      almacen: cells.almacen?.nombre || 'Sin Almacen',

      stock,

      seriales,

      creado: cells.fecha_creacion,
      editado: cells.ultima_actualizacion,
    }

    return formattedData
  })

  return rows
}
