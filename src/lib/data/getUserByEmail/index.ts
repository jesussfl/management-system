import {prisma} from "@/lib/prisma"

export const getUserByEmail = async (email: string) => {
    try {
      const user = await prisma.usuario.findUnique({ where: { email } });
  
      return user;
    } catch {
      return null;
    }
  };