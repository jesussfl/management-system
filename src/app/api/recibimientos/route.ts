import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions, auth } from '@/auth'
import { Prisma } from '@prisma/client'

type Recepciones = Prisma.RecepcionGetPayload<{
  include: {
    renglones: true
  }
}>

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body: Recepciones = await request.json()

    const { motivo, fecha_recepcion, renglones } = body

    if (!fecha_recepcion || !renglones) {
      return new NextResponse('Missing Fields', { status: 400 })
    }

    const response = await prisma.recepcion.create({
      data: {
        motivo,
        fecha_recepcion,
        renglones: {
          create: renglones,
        },
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)

    return new NextResponse('Internal Error', { status: 500 })
  }
}
