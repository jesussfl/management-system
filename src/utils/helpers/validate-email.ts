/**
 * Validates if the given email address is in a valid format.
 *
 * @param {string} email - The email address to be validated.
 * @return {boolean} - Returns true if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )

/**
 * Function to validate an email.
 *
 * @param {string} email - The email to be validated.
 * @return {boolean | string} - Returns true if the email is valid, otherwise returns an error message.
 */
export const handleEmailValidation = (email: string): boolean | string => {
  console.log('ValidateEmail was called with', email)

  const isValid = isValidEmail(email)

  /*This code snippet checks if the validity of an email has changed. 
  If the email has errors and is valid or if the email has no errors and is not valid, the validityChanged variable is set to true. 
  If validityChanged is true, it logs a message to the console.

  example:
  const validityChanged =
  (form.formState.errors.email && isValid) ||
  (!form.formState.errors.email && !isValid)
  (validityChanged) {
  console.log('Fire tracker with', isValid ? 'Valid' : 'Invalid')
  }
  */

  return isValid ? true : 'El email no es valido'
}
