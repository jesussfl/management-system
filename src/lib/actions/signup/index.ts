"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/utils/schemas";
import { getUserByEmail } from "@/lib/data/getUserByEmail";

import { prisma } from "@/lib/prisma";

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, adminPassword } = validatedFields.data;

  if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return { error: "Contraseña de administrador incorrecta", field: "adminPassword" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Este correo ya está registrado", field: "email" };
  }

  await prisma.usuario.create({
    data: {
      nombre : name,
      email,
      contrasena: hashedPassword,
      rol: {
        connectOrCreate:{
          where: {
            rol: "Administrador"
          },
          create: {
            rol: "Administrador",
            descripcion: 'Allows access to all features'
          }
        }
      }
    },
  });


  return { success: "Registrado correctamente" };
};