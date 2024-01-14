import NextAuth from 'next-auth';
import { authOptions } from '@/auth';
 
export default NextAuth(authOptions).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/dashboard/:path*'],
};