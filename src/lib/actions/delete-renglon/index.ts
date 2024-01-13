"use server"
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
export const deleteRenglon = async (id: number) => {

    const session = await auth();

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