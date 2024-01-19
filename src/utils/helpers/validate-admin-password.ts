/**
 * Validates the admin password.
 *
 * @param {string} password - The password to be validated.
 * @return {string} Returns an error message if the password is incorrect.
 */
export const validateAdminPassword = (password: string) => {
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return 'Contraseña de administrador incorrecta'
  }
}
