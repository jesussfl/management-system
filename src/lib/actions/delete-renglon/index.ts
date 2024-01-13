"use server"
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { revalidatePath } from 'next/cache';
export const deleteRenglon = async (id: number) => {

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error('You must be signed in to perform this action.');
    }

    await prisma.renglones.delete({
        where: {
            id
        }
    })

    revalidatePath('/dashboard/abastecimiento/recibimientos')

    

}