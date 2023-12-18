import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
// This function can be marked `async` if using `await` inside
export { default } from "next-auth/middleware"
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}