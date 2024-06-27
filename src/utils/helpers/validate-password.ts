type Params = {
  value: string
  options?: {
    minLength?: number
    maxLength?: number
    hasUppercase?: boolean
    hasLowercase?: boolean
    hasNumber?: boolean
    hasSymbol?: boolean
  }
}

const defaultOptions = {
  minLength: 8,
  hasUppercase: true,
  hasLowercase: true,
  hasNumber: true,
  hasSymbol: true,
}

/**
 * Validates a password based on certain criteria.
 *
 * @param {Params} params - The parameters for the validation.
 * @param {string} params.value - The password to be validated.
 * @param {Options} [params.options=defaultOptions] - The options for the validation.
 * @param {boolean} [params.options.hasUppercase] - Determines if the password must have at least one uppercase letter.
 * @param {boolean} [params.options.hasLowercase] - Determines if the password must have at least one lowercase letter.
 * @param {boolean} [params.options.hasNumber] - Determines if the password must have at least one number.
 * @param {boolean} [params.options.hasSymbol] - Determines if the password must have at least one symbol.
 * @return {string} - The error message if the password is not valid.
 */
export const validatePassword = ({
  value,
  options = defaultOptions,
}: Params) => {
  const hasUppercase = /[A-Z]/.test(value)
  const hasLowercase = /[a-z]/.test(value)
  const hasNumber = /[0-9]/.test(value)
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)

  if (options?.hasUppercase && !hasUppercase) {
    return 'La contraseña debe tener al menos una letra mayúscula'
  }

  if (options?.hasLowercase && !hasLowercase) {
    return 'La contraseña debe tener al menos una letra minúscula'
  }

  if (options?.hasNumber && !hasNumber) {
    return 'La contraseña debe tener al menos un número'
  }

  if (options?.hasSymbol && !hasSymbol) {
    return 'La contraseña debe tener al menos un simbolo'
  }
}
