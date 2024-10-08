/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  '/',
  '/auth/new-verification',
  '/asistencias',
  '/asistencias/consulta',
  '/asistencias/entrada',
  '/asistencias/salida',
  '/auth/login/pin',
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to DEFAULT_LOGIN_REDIRECT
 * @type {string[]}
 */
export const authRoutes = [
  '/auth/login',
  // '/auth/signup',
  '/auth/error',
  '/auth/pin',
  '/auth/new-password',
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/dashboard'
