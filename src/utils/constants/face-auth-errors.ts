/**
 * enum that represents error codes for Facial ID Authentication using FaceIO API https://faceio.net/.
 * Each error code has a corresponding error message defined in the ErrorMessage type.
 */
export enum faceioErrorCode {
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
  [key in faceioErrorCode]: string
}

/**
 * An object that maps error codes to corresponding error messages for Facial ID Authentication.
 * Error messages are written in Spanish.
 * @type {ErrorMessage}
 * @see {@link faceioErrorCode}
 * @see {@link ErrorMessage}
 * @example
 * const errorMessage = errorMessages[faceioErrorCode.UNRECOGNIZED_FACE];
 * console.log(errorMessage); // 'Face not recognized'
 *
 *
 */
export const errorMessages: ErrorMessage = {
  [faceioErrorCode.PERMISSION_REFUSED]: 'Permiso denegado',
  [faceioErrorCode.NO_FACES_DETECTED]: 'No se detectó ningun rostro',
  [faceioErrorCode.UNRECOGNIZED_FACE]:
    'El rostro no es reconocido en la base de datos, intente de nuevo o cree un ID Facial',
  [faceioErrorCode.MANY_FACES]: 'Hay más de un rostro en la imagen',
  [faceioErrorCode.PAD_ATTACK]: 'Ataque con almohadilla',
  [faceioErrorCode.FACE_MISMATCH]:
    'El segundo rostro no coincide con el primero',
  [faceioErrorCode.NETWORK_IO]: 'Error de conexión a internet',
  [faceioErrorCode.WRONG_PIN_CODE]: 'Código de seguridad incorrecto',
  [faceioErrorCode.PROCESSING_ERR]: 'Error de procesamiento',
  [faceioErrorCode.UNAUTHORIZED]:
    'El sistema no tiene permisos para usar esta funcionalidad',
  [faceioErrorCode.TERMS_NOT_ACCEPTED]: 'Debe aceptar los términos',
  [faceioErrorCode.UI_NOT_READY]: 'Interfaz de usuario no lista',
  [faceioErrorCode.SESSION_EXPIRED]: 'Sesión expirada',
  [faceioErrorCode.TIMEOUT]:
    'Parece que hay problemas con el servidor, intente de nuevo.',
  [faceioErrorCode.TOO_MANY_REQUESTS]: 'Demasiadas solicitudes',
  [faceioErrorCode.EMPTY_ORIGIN]: 'Origen vacío',
  [faceioErrorCode.FORBIDDDEN_ORIGIN]: 'Origen prohibido',
  [faceioErrorCode.FORBIDDDEN_COUNTRY]: 'Pais prohibido',
  [faceioErrorCode.UNIQUE_PIN_REQUIRED]: 'Código de seguridad único requerido',
  [faceioErrorCode.SESSION_IN_PROGRESS]:
    'Refresca la página para cargar un nuevo rostro',
  [faceioErrorCode.FACE_DUPLICATION]:
    'Ya existe un id facial con este rostro, si desea cambiarlo, elimine el id facial existente primero',
  [faceioErrorCode.MINORS_NOT_ALLOWED]: 'Menores no permitidos',
}
