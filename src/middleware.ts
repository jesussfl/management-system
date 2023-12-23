
// This function can be marked `async` if using `await` inside
export { default } from "next-auth/middleware"
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}