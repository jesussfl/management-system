"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/utils/schemas";
import { getPasswordResetTokenByToken } from "@/lib/data/password-reset-token";
import { getUserByEmail } from "@/lib/data/get-user-byEmail";
import { prisma } from "@/lib/prisma";
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    console.log("Invalid token!")

    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    console.log("Token has expired!")
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.usuario.update({
    where: { id: existingUser.id },
    data: { contrasena: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id }
  });
  console.log("Password updated!")
  return { success: "Password updated!" };
};