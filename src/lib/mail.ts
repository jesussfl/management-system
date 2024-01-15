import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.PUBLIC_URL;
export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
    ) => {
        await resend.emails.send({
            from: "mail@auth-masterclass-tutorial.com",
            to: email,
            subject: "2FA Code",
            html: `<p>Your 2FA code: ${token}</p>`
        });
    };
    
    export const sendPasswordResetEmail = async (
        email: string,
        token: string,
        ) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`


  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'jesussflr@gmail.com',
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`

    });
    console.log(data);
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }

};

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "mail@auth-masterclass-tutorial.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};

