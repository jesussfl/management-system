import { prisma } from "@/lib/prisma";

export async function getRenglones() {
    try {
        const data = await prisma.renglones.findMany();
        return data;
        
    } catch (error) {
    return {error: error}        
    }
}