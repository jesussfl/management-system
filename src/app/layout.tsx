import '@/utils/styles/globals.css'
import { Poppins as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/modules/common/components/theme-provider'
import { Toaster } from '@/modules/common/components/toast/toaster'
export const fontSans = FontSans({
  weight: ['400', '500', '700'],
  subsets: ['latin-ext'],
  variable: '--font-sans',
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background font-sans antialiased overflow-hidden',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
