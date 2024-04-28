// import Docxtemplater from 'docxtemplater'
// import PizZip from 'pizzip'
// import PizZipUtils from 'pizzip/utils/index.js'
// import * as fs from 'fs'
// import { patchDocument, PatchType, TextRun } from 'docx'
// Patch a document with patches

import { saveAs } from 'file-saver'
import { createReport } from 'docx-templates'
import { Despachos_Renglones, Prisma } from '@prisma/client'
import { FormValues } from './'

type Profesional_AbastecimientoWithRelations =
  Prisma.Profesional_AbastecimientoGetPayload<{
    include: {
      grado: true
      categoria: true
      componente: true
      unidad: true
    }
  }>
type Detalles = Omit<
  Despachos_Renglones,
  'id_despacho' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  seriales: string[]
}
export type ExportData = {
  destinatario_nombres: string
  destinatario_apellidos: string
  destinatario_cedula: string
  destinatario_cargo: string
  destinatario_grado: string
  destinatario_telefono: string
  autorizador: Profesional_AbastecimientoWithRelations
  abastecedor: Profesional_AbastecimientoWithRelations
  supervisor: Profesional_AbastecimientoWithRelations

  despacho: FormValues
  renglones: Detalles[]
}

export const exportDocumentNew = async (data: ExportData) => {
  console.log(data.renglones)
  const res = await fetch('/despachos.docx')
  const buffer = await res.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  const date = new Date()

  const report = await createReport({
    template: uint8Array,
    data: {
      fecha_actual: `${date.getDate()}`,
      mes_actual: `${date.getMonth()}`,
      anio_actual: `${date.getFullYear()}`,
      nombre: 'holaa',
      ...data,
    },
    cmdDelimiter: ['+++', '+++'],
  })
  const blob = new Blob([report], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  //convert to pdf

  saveAs(blob, `despacho_${data.destinatario_cedula}.docx`)
}
