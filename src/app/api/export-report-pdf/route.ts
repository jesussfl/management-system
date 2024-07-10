import { Despachos_Renglones, Prisma } from '@prisma/client'
import fetch from 'node-fetch'

import { NextRequest, NextResponse } from 'next/server'
import { getDocBlob } from '../helpers/get-doc-blob'

export type ExportRequest = {
  data: any
  url: string
  name: string
}

export async function POST(request: NextRequest) {
  const req: ExportRequest = await request.json()

  try {
    const docBlob = await getDocBlob(req.data, req.url)
    const fileBuffer = await docBlob.arrayBuffer()

    const formData = new FormData()
    formData.append(
      'files',
      new Blob([fileBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      'document.docx'
    )

    const response = await fetch(
      'https://demo.gotenberg.dev/forms/libreoffice/convert',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to convert document to PDF xd' },
        { status: 500 }
      )
    }

    const pdfBuffer = await response.arrayBuffer()
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${req.name}.pdf`,
      },
    })
  } catch (error) {
    console.error('Error generating document:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
