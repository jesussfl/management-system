'use client'

import * as React from 'react'
import { useTransition } from 'react'

import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { isValidEmail } from '@/utils/helpers/isValidEmail'
import { signup } from '@/lib/actions/signup'
import { signIn } from 'next-auth/react'
type FormValues = {
  email: string
  password: string
  confirmPassword: string
  name: string
  adminPassword: string
}

export function SignupForm() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      adminPassword: '',
    },
  })

  const [isPending, startTransition] = useTransition()
  const handleEmailValidation = (email: string) => {
    console.log('ValidateEmail was called with', email)

    const isValid = isValidEmail(email)

    const validityChanged =
      (form.formState.errors.email && isValid) ||
      (!form.formState.errors.email && !isValid)
    if (validityChanged) {
      console.log('Fire tracker with', isValid ? 'Valid' : 'Invalid')
    }

    return isValid ? true : 'El email no es valido'
  }
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'custom',
        message: 'Las contraseñas no coinciden',
      })
      return
    }

    if (values.adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      form.setError('adminPassword', {
        type: 'custom',
        message: 'Contraseña de administrador incorrecta',
      })
      return
    }

    startTransition(() => {
      signup(values).then((data) => {
        if (data?.error) {
          form.setError(data.field as any, {
            type: 'custom',
            message: data.error,
          })
        }

        if (data?.success) {
          form.reset()
          toast({
            title: 'Exitoso',
            description: data.success,
            variant: 'success',
          })
          signIn('credentials', {
            email: values.email,
            password: values.password,
            callbackUrl: '/dashboard',
          })
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 3,
                message:
                  'El nombre de usuario debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 40,
                message: 'El nombre de usuario no puede ser tan largo',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Nombre y apellido</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Este campo es requerido',
              validate: handleEmailValidation,
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{ required: 'Contraseña requerida' }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    disabled={isPending}
                    placeholder="**********"
                  />
                </FormControl>
                <FormDescription>
                  La contraseña debe contener al menos 8 carácteres y 2
                  especiales
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{ required: 'Contraseña requerida' }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    disabled={isPending}
                    placeholder="**********"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adminPassword"
            rules={{ required: 'Contraseña de administrador requerida' }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Contraseña de administrador</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    disabled={isPending}
                    placeholder="**********"
                  />
                </FormControl>
                <FormDescription>
                  Es necesario para validar el acceso al panel de administración
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Registrarme
          </Button>
        </div>
      </form>
    </Form>
  )
}

// 'use client'

// import * as React from 'react'

// import { cn } from '@/lib/utils'
// import { Icons } from '@/modules/common/components/icons/icons'
// import { Button } from '@/modules/common/components/button'
// import { Input } from '@/modules/common/components/input/input'
// import { Label } from '@/modules/common/components/label/label'
// import { useRouter } from 'next/navigation'
// interface SignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}
// const ADMIN_PASSWORD = 'admin'
// export function SignupForm({ className, ...props }: SignupFormProps) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = React.useState<boolean>(false)
//   const [email, setEmail] = React.useState<string>('')
//   const [password, setPassword] = React.useState<string>('')
//   const [username, setUsername] = React.useState<string>('')
//   const [adminPassword, setAdminPassword] = React.useState<string>('')
//   const [confirmPassword, setConfirmPassword] = React.useState<string>('')

//   async function onSubmit(event: React.SyntheticEvent) {
//     event.preventDefault()
//     setIsLoading(true)

//     if (password !== confirmPassword) {
//       setIsLoading(false)
//       return
//     }
//     if (adminPassword !== ADMIN_PASSWORD) {
//       setIsLoading(false)
//       return
//     }

//     try {
//       const response = await fetch('/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, email, password }),
//       })
//       if (response.ok) {
//         console.info('user created successfully')
//         setIsLoading(false)
//         router.push('/dashboard')
//         return
//       } else {
//         setIsLoading(false)
//         console.error('error', response)
//         return
//       }
//     } catch (error) {
//       setIsLoading(false)
//       console.log(error)
//       return
//     }
//   }

//   return (
//     <div className={cn('grid gap-6', className)} {...props}>
//       <form onSubmit={onSubmit}>
//         <div className="grid gap-6">
//           <div className="grid gap-3">
//             <Label htmlFor="username">Nombre de usuario</Label>
//             <Input
//               id="username"
//               placeholder="Introduce tu nombre de usuario"
//               type="username"
//               autoCapitalize="none"
//               autoComplete="username"
//               autoCorrect="off"
//               disabled={isLoading}
//               value={username}
//               onChange={(event) => setUsername(event.target.value)}
//             />
//           </div>
//           <div className="grid gap-3">
//             <Label htmlFor="email">Correo electrónico</Label>
//             <Input
//               id="email"
//               placeholder="nombre@ejemplo.com"
//               type="email"
//               autoCapitalize="none"
//               autoComplete="email"
//               autoCorrect="off"
//               disabled={isLoading}
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//             />
//           </div>
//           <div className="grid gap-3">
//             <Label htmlFor="password">Contraseña</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Introduce tu contraseña"
//               disabled={isLoading}
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//             />
//           </div>

//           <div className="grid gap-3">
//             <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>

//             <Input
//               id="confirmPassword"
//               type="password"
//               placeholder="Confirma tu contraseña"
//               disabled={isLoading}
//               value={confirmPassword}
//               onChange={(event) => setConfirmPassword(event.target.value)}
//             />
//           </div>
//           <div className="grid gap-3">
//             <Label htmlFor="adminPassword">Contraseña del administrador</Label>

//             <Input
//               id="adminPassword"
//               type="password"
//               placeholder="Introduce la contraseña del administrador"
//               disabled={isLoading}
//               value={adminPassword}
//               onChange={(event) => setAdminPassword(event.target.value)}
//             />
//           </div>
//           <Button disabled={isLoading} type="submit">
//             {isLoading && (
//               <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//             )}
//             Registrarme
//           </Button>
//         </div>
//       </form>
//     </div>
//   )
// }
