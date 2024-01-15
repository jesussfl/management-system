import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/prisma";
import { getPasswordResetTokenByEmail } from "@/lib/data/password-reset-token";


export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 60 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  const hasExpired = existingToken && new Date(existingToken.expires) < new Date();

  if (!hasExpired ) {
    throw new Error('A token was already sent to this email');

  }
    
  if (hasExpired || !existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return passwordResetToken;
}

