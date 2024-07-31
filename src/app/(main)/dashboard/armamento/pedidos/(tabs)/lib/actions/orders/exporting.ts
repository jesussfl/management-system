// import Docxtemplater from 'docxtemplater'
// import PizZip from 'pizzip'
// import PizZipUtils from 'pizzip/utils/index.js'
// import * as fs from 'fs'
// import { patchDocument, PatchType, TextRun } from 'docx'
// Patch a document with patches

import { saveAs } from 'file-saver'
import { createReport } from 'docx-templates'
import { Prisma, Recepciones_Renglones } from '@prisma/client'

type Profesional_ArmamentoWithRelations =
  Prisma.Profesional_ArmamentoGetPayload<{
    include: {
      grado: true
      categoria: true
      componente: true
      unidad: true
    }
  }>
type Detalles = Omit<
  Recepciones_Renglones,
  'id_recepcion' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
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
  autorizador: Profesional_ArmamentoWithRelations
  abastecedor: Profesional_ArmamentoWithRelations
  supervisor: Profesional_ArmamentoWithRelations
  unidad: string
  // despacho: FormValues
  renglones: Detalles[]
  codigo: string
  motivo: string
}

export const exportDocumentNew = async (data: ExportData) => {
  const res = await fetch('/guia-recepcion.docx')
  const buffer = await res.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  const date = new Date()

  const report = await createReport({
    template: uint8Array,
    data: {
      fecha_actual: `${date.getDate()}`,
      mes_actual: `${date.getMonth()}`,
      anio_actual: `${date.getFullYear()}`,

      ...data,
    },
    cmdDelimiter: ['+++', '+++'],
  })
  const blob = new Blob([report], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  //convert to pdf

  saveAs(blob, `recepcion_${data.destinatario_cedula}_${date.getTime()}.docx`)
}
