import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name,
    description,
    classification,
    category,
    type,
    presentation,
    modelNumber,
    measureUnit,
  } = body

  if (
    !name ||
    !description ||
    !classification ||
    !category ||
    !type ||
    !presentation ||
    !modelNumber ||
    !measureUnit
  ) {
    return new NextResponse('Missing Fields', {
      status: 400,
      statusText: 'Missing Fields',
    })
  }

  const exist = await prisma.renglones.findUnique({
    where: {
      nombre: name,
    },
  })

  if (exist) {
    return new NextResponse('Renglon already exists', {
      status: 400,
      statusText: 'Renglon already exists',
    })
  }

  const renglon = await prisma.renglones.create({
    data: {
      nombre: name,
      descripcion: description,
      clasificacion: classification,
      categoria: category,
      tipo: type,
      presentacion: presentation,
      numero_parte: modelNumber,
      unidad_de_medida: measureUnit,
    },
  })
  return NextResponse.json(renglon)
}

export async function GET(request: Request) {
  const body = await request.json()

  const { id } = body

  if (!id) {
    const renglones = await prisma.renglones.findMany()
    return NextResponse.json(renglones)
  }
  const renglon = await prisma.renglones.findUnique({
    where: {
      id,
    },
  })

  return NextResponse.json(renglon)
}
