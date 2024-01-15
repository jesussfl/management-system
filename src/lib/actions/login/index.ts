"use server";
import * as z from "zod";

import { AuthError } from "next-auth";
import { signIn } from "@/auth"
import { LoginSchema } from "@/utils/schemas";
import { getUserByEmail } from "@/lib/data/get-user-byEmail";

import bcrypt from "bcryptjs"

export default async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) {
  const validatedFields = LoginSchema.safeParse(values);

  
  if (!validatedFields.success) {
    return { error: 'The email or password is invalid' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.contrasena) {
    return { error: "No hay un usuario con este correo", field: "email" }
  }
  const passwordMatch = await bcrypt.compare(password, existingUser.contrasena)
  if (!passwordMatch) {
    return { error: "Contraseña incorrecta", field: "password" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || '/dashboard',
    })

    return { success: "Inicio de sesión exitoso" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }
};

