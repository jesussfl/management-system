import { createReport } from 'docx-templates'

export const getDocBlob = async (data: any, url: string) => {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  const date = new Date()

  const report = await createReport({
    template: uint8Array,
    data: {
      fecha_actual: `${date.getDate()}`,
      mes_actual: `${date.getMonth() + 1}`, // Los meses en JavaScript son de 0 a 11
      anio_actual: `${date.getFullYear()}`,
      ...data,
    },
    cmdDelimiter: ['+++', '+++'],
  })

  return new Blob([report], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}
