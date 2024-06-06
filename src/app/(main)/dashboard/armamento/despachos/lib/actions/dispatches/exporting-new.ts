'use server'

import {
  pipe,
  gotenberg,
  convert,
  office,
  to,
  landscape,
  set,
  filename,
  please,
} from 'gotenberg-js-client'

const toPDF = pipe(
  gotenberg('http://localhost:3001'),
  convert,
  office,
  to(landscape),
  set(filename('result.pdf')),
  please
)

export const getPdf = async (fileBuffer: ArrayBuffer) => {
  const pdfStream = await toPDF({
    'document.docx': Buffer.from(fileBuffer),
  })
  const pdfBlob = await streamToBlob(pdfStream)

  return pdfBlob
}

// Helper function to convert NodeJS.ReadableStream to Blob
export const streamToBlob = (stream: NodeJS.ReadableStream): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk: Uint8Array) => {
      chunks.push(chunk)
    })
    stream.on('end', () => {
      resolve(new Blob(chunks))
    })
    stream.on('error', reject)
  })
}
