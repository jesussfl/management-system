'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import mime from 'mime'
import { join } from 'path'
import { stat, mkdir, writeFile } from 'fs/promises' // Agregamos unlink
import { differenceInMinutes } from 'date-fns'

export type ItemsWithAllRelations = Prisma.PromiseReturnType<typeof getAllItems>
export const createItem = async (
  data: Prisma.RenglonUncheckedCreateInput,
  image: FormData | null,
  section: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      section === 'Abastecimiento'
        ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
        : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const { nombre, tipo_medida_unidad } = data
  // console.log(tipo_medida_unidad)
  if (!tipo_medida_unidad) {
    return {
      success: false,
      error:
        'Debe seleccionar un tipo de medida o seleccionar una unidad de empaque',
    }
  }
  const exist = await prisma.renglon.findUnique({
    where: {
      nombre,
    },
  })
  if (exist) {
    return {
      field: 'nombre',
      success: false,
      error: 'El nombre de este renglón ya existe',
    }
  }
  if (!image) {
    await prisma.renglon.create({
      data: {
        ...data,
        peso: !data.peso ? 0 : data.peso,
        servicio: section,
      },
    })

    await registerAuditAction(
      'CREAR',
      `Se ha creado un renglón de ${section} con el nombre: ${nombre}`
    )
    revalidatePath(`/dashboard/${section.toLowerCase()}/inventario`)

    return {
      success: 'Se ha creado el renglón correctamente',
      error: false,
    }
  }
  const imageData = (image.get('image') as File) || null

  const buffer = Buffer.from(await imageData.arrayBuffer())
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-')}`

  const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

  try {
    await stat(uploadDir)
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      // This is for checking the directory is exist (ENOENT : Error No Entry)
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(
        'Error while trying to create directory when uploading a file\n',
        e
      )
      return { error: 'Something went wrong.' }
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${imageData.name.replace(
      /\.[^/.]+$/,
      ''
    )}-${uniqueSuffix}.${mime.getExtension(imageData.type)}`
    await writeFile(`${uploadDir}/${filename}`, buffer)
    const fileUrl = `${relativeUploadDir}/${filename}`

    // Save to database
    await prisma.renglon.create({
      data: {
        ...data,
        imagen: fileUrl, // Agregamos la ruta de la imagen a la base de datos
        peso: !data.peso ? 0 : data.peso,
        servicio: section,
      },
    })

    await registerAuditAction(
      'CREAR',
      `Se ha creado el renglon de ${section} con el nombre ${nombre}`
    )
    revalidatePath(`/dashboard/${section.toLowerCase()}/inventario`)

    return {
      success: 'Se ha creado el renglón correctamente',
      error: false,
    }
  } catch (e) {
    console.error('Error while trying to upload a file\n', e)
    return { error: 'Something went wrong.' }
  }
}

export const updateItem = async (
  id: number,
  data: Prisma.RenglonUpdateInput,
  image: FormData | null,
  section: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()
  // console.log(data)
  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      section === 'Abastecimiento'
        ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
        : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.renglon.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El renglón no existe',
      success: null,
    }
  }

  if (!image) {
    await prisma.renglon.update({
      where: {
        id,
      },
      data: {
        ...data,
        peso:
          data.peso === undefined || data.peso === null ? undefined : data.peso,
      },
    })

    await registerAuditAction(
      'ACTUALIZAR',
      `Se ha actualizado un renglón de ${section.toLowerCase()} con el nombre: ${
        data.nombre
      }`
    )
    revalidatePath(`/dashboard/${section.toLowerCase()}/inventario`)

    return {
      success: 'Se ha actualizado el renglón correctamente',
      error: false,
    }
  }

  const imageData = (image.get('image') as File) || null

  const buffer = Buffer.from(await imageData.arrayBuffer())
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-')}`

  const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

  try {
    await stat(uploadDir)
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      // This is for checking the directory is exist (ENOENT : Error No Entry)
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(
        'Error while trying to create directory when uploading a file\n',
        e
      )
      return { error: 'Something went wrong.' }
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${imageData.name.replace(
      /\.[^/.]+$/,
      ''
    )}-${uniqueSuffix}.${mime.getExtension(imageData.type)}`
    await writeFile(`${uploadDir}/${filename}`, buffer)
    const fileUrl = `${relativeUploadDir}/${filename}`

    await prisma.renglon.update({
      where: {
        id,
      },
      data: {
        ...data,

        imagen: fileUrl,
      },
    })

    await registerAuditAction(
      'ACTUALIZAR',
      `Se ha actualizado el renglón de ${section.toLowerCase()} con el id: ${id} y el nombre ${exist?.nombre}`
    )

    // Save to database

    revalidatePath(`/dashboard/${section.toLowerCase()}/inventario`)
    return {
      success: 'Se ha actualizado el renglón correctamente',
      error: false,
    }
  } catch (e) {
    console.error('Error while trying to upload a file\n', e)
    return { error: 'Something went wrong.' }
  }
}

export const deleteItem = async (
  id: number,
  section: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      section === 'Abastecimiento'
        ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
        : SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.renglon.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El renglón no existe',
      success: false,
    }
  }

  await prisma.renglon.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se ha eliminado el renglon de ${section.toLowerCase()} con el id ${id} y el nombre ${exist?.nombre}`
  )
  revalidatePath(`/dashboard/${section.toLowerCase()}/inventario`)

  return {
    success: 'Se ha eliminado el renglón correctamente',
    error: false,
  }
}
export const recoverItem = async (
  id: number,
  section: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName:
      section === 'Abastecimiento'
        ? SECTION_NAMES.INVENTARIO_ABASTECIMIENTO
        : SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.renglon.update({
    where: {
      id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    `Se ha recuperado el renglon de ${section.toLowerCase()} con el id ${id} y el nombre ${exist?.nombre}`
  )
  revalidatePath(`/dashboard/${section.toLowerCase()}/inventario`)

  return {
    success: 'Se ha recuperado el renglón correctamente',
    error: false,
  }
}
export const deleteMultipleItems = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.renglon.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado los renglones de abastecimiento con los siguientes ids: ${ids}`
  )
  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Se ha eliminado el renglón correctamente',
    error: false,
  }
}

export const checkItemExistance = async (name: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  if (!name) {
    return false
  }

  const exists = await prisma.renglon.findUnique({
    where: {
      nombre: name,
    },
  })

  return !!exists
}

export const getAllItems = async (
  onlyActives?: boolean,
  section?: 'Abastecimiento' | 'Armamento'
) => {
  const sessionResponse = await validateUserSession()
  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const renglones = await prisma.renglon.findMany({
    orderBy: {
      ultima_actualizacion: 'desc',
    },
    where: {
      servicio: section,
      fecha_eliminacion: onlyActives ? null : undefined,
    },
    include: {
      clasificacion: true,
      unidad_empaque: true,
      almacen: true,
      categoria: true,
      subsistema: true,
      seriales: true,
    },
  })
  return renglones
}

export const getItemById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }
  const renglon = await prisma.renglon.findUnique({
    where: {
      id,
    },
    include: {
      clasificacion: true,
      unidad_empaque: true,
      almacen: true,
      categoria: true,
      subsistema: true,
      seriales: true,
    },
  })

  if (!renglon) {
    throw new Error('El renglon no existe')
  }
  return renglon
}

export const showNotification = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const user = await prisma.usuario.findUnique({
    where: {
      id: session.user.id,
    },

    select: {
      ultima_notificacion: true,
    },
  })

  if (!user?.ultima_notificacion) {
    await prisma.usuario.update({
      where: {
        id: session.user.id,
      },
      data: {
        ultima_notificacion: new Date(),
      },
    })

    return true
  }

  if (differenceInMinutes(new Date(), user.ultima_notificacion) > 1) {
    await prisma.usuario.update({
      where: {
        id: session.user.id,
      },
      data: {
        ultima_notificacion: new Date(),
      },
    })
    return true
  }

  return false
}
