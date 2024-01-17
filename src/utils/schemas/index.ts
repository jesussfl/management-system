import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'El correo no es valido',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})
export const LoginByFaceIDSchema = z.object({
  facialID: z.string().min(1, {
    message: 'Facial ID is required',
  }),
})
export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
  adminPassword: z.string().min(1, {
    message: 'Admin password is required',
  }),
  name: z.string().min(1, {
    message: 'Username is required',
  }),
})
export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
})
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required',
  }),
})
