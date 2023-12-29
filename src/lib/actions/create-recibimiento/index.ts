"use server"
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type InputRecibimientos = Prisma.RecibimientosGetPayload<{
    include: {
        detalles: true
    }
}>;
type Detalles = {
    id_renglon: number
    cantidad: number
    fecha_fabricacion: Date
    fecha_vencimiento: Date
  }
  
  type FormValues = {
    fecha_recibimiento: Date
    motivo: string
    detalles: Detalles[]
  }
export const createRecibimiento = async (data: FormValues) => {

try {
    
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error('You must be signed in to perform this action.');
    }

    const { motivo, fecha_recibimiento, detalles } = data


    if (!fecha_recibimiento || !detalles) {
        return {
            error: "Missing Fields",
        };
    }
    await prisma.recibimientos.create({
        data: {
            motivo,
            fecha_recibimiento,
            detalles: {
                create: detalles
            }
        }
    })
    revalidatePath('/dashboard/abastecimiento/recibimientos')
} catch (error) {
    console.log(error);
}
 

}