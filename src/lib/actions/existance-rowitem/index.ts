'use server'
import { auth } from "@/auth"
import {prisma} from "@/lib/prisma"
export const checkRowItemExists = async (name: string) => {

    const session = await auth()
    if (!session?.user) {

        throw new Error('You must be signed in to perform this action')
    }

    if (!name) {
        return false
    }

    const exists = await prisma.renglones.findUnique({

        where: {
            nombre: name
        }
    })

    return !!exists
}