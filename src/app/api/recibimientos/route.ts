import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { Prisma } from '@prisma/client';

type Recibimientos = Prisma.RecibimientosGetPayload<{
    include: {
        detalles: true
    }
}>;

export async function POST(request : Request) {

    try {
        
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body : Recibimientos = await request.json();

        const { motivo, fecha_recibimiento, detalles  } = body

        if (!fecha_recibimiento || !detalles) {
          return new NextResponse('Missing Fields', { status: 400 });
        }

      const response = await prisma.recibimientos.create({
        data: {
          motivo,
          fecha_recibimiento,
          detalles : {
            create : detalles
          }
        }
      })

      return NextResponse.json(response)

    } catch (error) {

        console.log(error);

        return new NextResponse('Internal Error', { status: 500 });
        
    }

    
}