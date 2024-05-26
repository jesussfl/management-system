'use server'
import { saveAs } from 'file-saver'
import { createReport } from 'docx-templates'
import fetch from 'node-fetch'

// type Profesional_AbastecimientoWithRelations =
//   Prisma.Profesional_AbastecimientoGetPayload<{
//     include: {
//       grado: true
//       categoria: true
//       componente: true
//       unidad: true
//     }
//   }>

// type Detalles = Omit<
//   Despachos_Renglones,
//   'id_despacho' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
// > & {
//   seriales: string[]
// }

// export type ExportData = {
//   destinatario_nombres: string
//   destinatario_apellidos: string
//   destinatario_cedula: string
//   destinatario_cargo: string
//   destinatario_grado: string
//   destinatario_telefono: string
//   autorizador: Profesional_AbastecimientoWithRelations
//   abastecedor: Profesional_AbastecimientoWithRelations
//   supervisor: Profesional_AbastecimientoWithRelations
//   unidad: string
//   despacho: FormValues
//   renglones: Detalles[]
//   codigo: string
//   motivo: string
// }

// export const getDocBlob = async (data: ExportData) => {
//   const res = await fetch('http://localhost:3000/despachos.docx')
//   const buffer = await res.arrayBuffer()
//   const uint8Array = new Uint8Array(buffer)
//   const date = new Date()

//   const report = await createReport({
//     template: uint8Array,
//     data: {
//       fecha_actual: `${date.getDate()}`,
//       mes_actual: `${date.getMonth() + 1}`, // Los meses en JavaScript son de 0 a 11
//       anio_actual: `${date.getFullYear()}`,
//       nombre: 'holaa',
//       ...data,
//     },
//     cmdDelimiter: ['+++', '+++'],
//   })

//   return new Blob([report], {
//     type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   })
// }

// export const exportDocumentNew = async (data: ExportData) => {
//   const docBlob = await getDocBlob(data)
//   const fileBuffer = await docBlob.arrayBuffer()

//   // Crear un FormData para enviar el documento a Gotenberg
//   const formData = new FormData()
//   formData.append(
//     'files',
//     new Blob([fileBuffer], {
//       type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     }),
//     'document.docx'
//   )

//   // Convertir el documento a PDF usando Gotenberg
//   const response = await fetch(
//     'http://localhost:3001/forms/libreoffice/convert',
//     {
//       method: 'POST',
//       body: formData,
//     }
//   )

//   if (!response.ok) {
//     throw new Error('Failed to convert document to PDF')
//   }

//   const pdfBuffer = await response.arrayBuffer()
//   const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' })
//   console.log(pdfBlob)

//   saveAs(pdfBlob, `despacho_${data.destinatario_cedula}.pdf`)
// }
