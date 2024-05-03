import mime from 'mime'
import { join } from 'path'
import { stat, mkdir, writeFile, unlink } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import _ from 'lodash'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const image = (formData.get('image') as File) || null

  const buffer = Buffer.from(await image.arrayBuffer())
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-')}`

  const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

  try {
    await stat(uploadDir)
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      // This is for checking the directory is exist (ENOENT : Error No Entry)
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(
        'Error while trying to create directory when uploading a file\n',
        e
      )
      return NextResponse.json(
        { error: 'Something went wrong.' },
        { status: 500 }
      )
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${image.name.replace(
      /\.[^/.]+$/,
      ''
    )}-${uniqueSuffix}.${mime.getExtension(image.type)}`
    await writeFile(`${uploadDir}/${filename}`, buffer)
    const fileUrl = `${relativeUploadDir}/${filename}`

    // Save to database
    const result = await prisma.image.create({
      data: {
        image: fileUrl,
      },
    })

    return NextResponse.json({ user: result })
  } catch (e) {
    console.error('Error while trying to upload a file\n', e)
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}

// Función para eliminar un archivo
export async function DELETE(req: NextRequest) {
  const { filename } = await req.json()

  // Construye la ruta completa al archivo
  const filePath = join(process.cwd(), 'public', filename)

  try {
    // Intenta eliminar el archivo
    await unlink(filePath)
    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 })
  }
}
