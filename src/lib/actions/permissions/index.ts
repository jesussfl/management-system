"use server"
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Permiso } from '@prisma/client'
export const createPermiso = async (data : Permiso) => {
   
        const session = await auth()
        if(!session?.user){
            throw new Error('You must be signed in to perform this action')
        }
        const {  key } = data
        const exist = await prisma.permiso.findUnique({
            where: {
                 key
            }
        })
        if(exist){
            return {
                field: 'permiso',
                error: 'Este permiso ya existe'
            }
        }
    
        await prisma.permiso.create({
            data
        })
        revalidatePath('/dashboard/abastecimiento/usuarios')
        return {
            success: 'Permiso creado exitosamente'
        }

}

export const updatePermiso = async (id : number, data: Permiso) => {
 
        const session = await auth()
        if(!session?.user){
            throw new Error('You must be signed in to perform this action')
        }

        await prisma.permiso.update({
            where: {
                id
            },
            data
        })
        revalidatePath('/dashboard/abastecimiento/usuarios')
        return {
            success: 'Permiso actualizado exitosamente'
        }

}

export const deletePermiso = async (id: number) => {

    const session = await auth();

    if (!session?.user) {
        throw new Error('You must be signed in to perform this action');
    }

    await prisma.permiso.delete({
        where: {
            id
        }
    })

    revalidatePath('/dashboard/abastecimiento/usuarios');

    

}