"use server"
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Renglones } from '@prisma/client'

type FormValues = Omit<Renglones, 'id'>
export const createRenglon = async (data : FormValues) => {
    try {
        
        const session = await getServerSession(authOptions)
        if(!session?.user){
            throw new Error('You must be signed in to perform this action')
        }
        const { nombre } = data
        const exist = await prisma.renglones.findUnique({
            where: {
                nombre
            }
        })
        if(exist){
            throw new Error('Renglon already exists')
        }
    
        await prisma.renglones.create({
            data
        })
        revalidatePath('/dashboard/abastecimiento/renglones')
    } catch (error) {
        console.log(error)
    }
}

export const updateRenglon = async (id : number, data: FormValues) => {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user){
            throw new Error('You must be signed in to perform this action')
        }


        await prisma.renglones.update({
            where: {
                id
            },
            data
        })
        revalidatePath('/dashboard/abastecimiento/inventario')
    } catch (error) {
        console.log(error)
    }
}