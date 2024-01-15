"use server"
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Rol } from '@prisma/client'
export const createRol = async (data : Rol) => {
   
        const session = await auth()
        if(!session?.user){
            throw new Error('You must be signed in to perform this action')
        }
        const {  rol } = data
        const exist = await prisma.rol.findUnique({
            where: {
                 rol
            }
        })
        if(exist){
            return {
                field: 'rol',
                error: 'Este rol ya existe'
            }
        }
    
        await prisma.rol.create({
            data
        })
        revalidatePath('/dashboard/abastecimiento/usuarios')
        return {
            success: 'Rol creado exitosamente'
        }

}

export const updateRol = async (id : number, data: Rol) => {
 
        const session = await auth()
        if(!session?.user){
            throw new Error('You must be signed in to perform this action')
        }

        await prisma.rol.update({
            where: {
                id
            },
            data
        })
        revalidatePath('/dashboard/abastecimiento/usuarios')
        return {
            success: 'Rol actualizado exitosamente'
        }

}

export const deleteRol = async (id: number) => {

    const session = await auth();

    if (!session?.user) {
        throw new Error('You must be signed in to perform this action');
    }

    await prisma.rol.delete({
        where: {
            id
        }
    })

    revalidatePath('/dashboard/abastecimiento/usuarios');

    

}