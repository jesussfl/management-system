import '@/utils/styles/globals.css'
import { Poppins as FontSans } from 'next/font/google'
import localFont from 'next/font/local'
import { cn } from '@/utils/utils'
import { ThemeProvider } from '@/modules/common/components/theme-provider'
import { Toaster } from '@/modules/common/components/toast/toaster'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
// export const fontSans = FontSans({
//   weight: ['400', '500', '700'],
//   subsets: ['latin-ext'],
//   variable: '--font-sans',
// })
const fontSans = localFont({
  src: [
    {
      path: '../../public/fonts/Poppins-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/Poppins-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/Poppins-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../../public/fonts/Poppins-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-sans',
})
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
