/**
 * enum that represents error codes for Facial ID Authentication using FaceIO API https://faceio.net/.
 * Each error code has a corresponding error message defined in the ErrorMessage type.
 */
export enum fioErrCode {
  PERMISSION_REFUSED = 1,
  NO_FACES_DETECTED = 2,
  UNRECOGNIZED_FACE = 3,
  MANY_FACES = 4,
  PAD_ATTACK = 5,
  FACE_MISMATCH = 6,
  NETWORK_IO = 7,
  WRONG_PIN_CODE = 8,
  PROCESSING_ERR = 9,
  UNAUTHORIZED = 10,
  TERMS_NOT_ACCEPTED = 11,
  UI_NOT_READY = 12,
  SESSION_EXPIRED = 13,
  TIMEOUT = 14,
  TOO_MANY_REQUESTS = 15,
  EMPTY_ORIGIN = 16,
  FORBIDDDEN_ORIGIN = 17,
  FORBIDDDEN_COUNTRY = 18,
  UNIQUE_PIN_REQUIRED = 19,
  SESSION_IN_PROGRESS = 20,
  FACE_DUPLICATION = 21,
  MINORS_NOT_ALLOWED = 22,
}
export type ErrorMessage = {
  [key in fioErrCode]: string
}

/**
 * An object that maps error codes to corresponding error messages for Facial ID Authentication.
 * Error messages are written in Spanish.
 * @type {ErrorMessage}
 * @see {@link fioErrCode}
 * @see {@link ErrorMessage}
 * @example
 * const errorMessage = errorMessages[fioErrCode.UNRECOGNIZED_FACE];
 * console.log(errorMessage); // 'Face not recognized'
 *
 *
 */
export const errorMessages: ErrorMessage = {
  [fioErrCode.PERMISSION_REFUSED]: 'Permiso denegado',
  [fioErrCode.NO_FACES_DETECTED]: 'No se detectó ningun rostro',
  [fioErrCode.UNRECOGNIZED_FACE]:
    'El rostro no es reconocido en la base de datos, intente de nuevo o cree un ID Facial',
  [fioErrCode.MANY_FACES]: 'Hay más de un rostro en la imagen',
  [fioErrCode.PAD_ATTACK]: 'Ataque con almohadilla',
  [fioErrCode.FACE_MISMATCH]: 'El segundo rostro no coincide con el primero',
  [fioErrCode.NETWORK_IO]: 'Error de red',
  [fioErrCode.WRONG_PIN_CODE]: 'Código de seguridad incorrecto',
  [fioErrCode.PROCESSING_ERR]: 'Error de procesamiento',
  [fioErrCode.UNAUTHORIZED]: 'No autorizado',
  [fioErrCode.TERMS_NOT_ACCEPTED]: 'Debe aceptar los términos',
  [fioErrCode.UI_NOT_READY]: 'Interfaz de usuario no lista',
  [fioErrCode.SESSION_EXPIRED]: 'Sesión expirada',
  [fioErrCode.TIMEOUT]: 'Timeout',
  [fioErrCode.TOO_MANY_REQUESTS]: 'Demasiadas solicitudes',
  [fioErrCode.EMPTY_ORIGIN]: 'Origen vacío',
  [fioErrCode.FORBIDDDEN_ORIGIN]: 'Origen prohibido',
  [fioErrCode.FORBIDDDEN_COUNTRY]: 'Pais prohibido',
  [fioErrCode.UNIQUE_PIN_REQUIRED]: 'Código de seguridad único requerido',
  [fioErrCode.SESSION_IN_PROGRESS]: 'Sesión en curso',
  [fioErrCode.FACE_DUPLICATION]: 'Cara duplicada',
  [fioErrCode.MINORS_NOT_ALLOWED]: 'Menores no permitidos',
}