import { NextRequest, NextResponse } from 'next/server'
import { getDocBlob } from '../helpers/get-doc-blob'
import { ExportRequest } from '../export-pdf/route'
export async function POST(request: NextRequest) {
  const req: ExportRequest = await request.json()

  try {
    const docBlob = await getDocBlob(req.data, req.url)
    const docBuffer = await docBlob.arrayBuffer()

    return new NextResponse(Buffer.from(docBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${req.name}.docx`,
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
