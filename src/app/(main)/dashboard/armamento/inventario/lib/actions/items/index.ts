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
import { stat, mkdir, writeFile, unlink } from 'fs/promises' // Agregamos unlink
export const createItem = async (
  data: Prisma.RenglonUncheckedCreateInput,
  image: FormData | null
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const { nombre, imagen } = data

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
        servicio: 'Armamento',
      },
    })

    await registerAuditAction(
      `Se ha creado el renglon de armamento con el nombre: ${nombre}`
    )
    revalidatePath('/dashboard/armamento/inventario')

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
        servicio: 'Armamento',
      },
    })

    await registerAuditAction(
      `Se ha creado el renglon de armamento con el nombre: ${nombre}`
    )
    revalidatePath('/dashboard/armamento/inventario')

    return {
      success: 'Se ha creado el renglón correctamente',
      error: false,
    }
  } catch (e) {
    console.error('Error while trying to upload a file\n', e)
    return { error: 'Something went wrong.' }
  }
  // await prisma.renglon.create({
  //   data,
  // })

  // await registerAuditAction(`Se ha creado el renglon ${nombre}`)
  // revalidatePath('/dashboard/armamento/inventario')

  // return {
  //   success: 'Se ha creado el renglón correctamente',
  //   error: false,
  // }
}

export const updateItem = async (
  id: number,
  data: Prisma.RenglonUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
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

  await prisma.renglon.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    `Se ha actualizado el renglón de armamento con el nombre ${exist?.nombre} y con el id ${exist?.id}`
  )
  revalidatePath('/dashboard/armamento/inventario')
}

export const deleteItem = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
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
    `Se ha eliminado el renglon de armamento con el nombre ${exist?.nombre} y con el id ${id}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    success: 'Se ha eliminado el renglón correctamente',
    error: false,
  }
}

export const deleteMultipleItems = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
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
    `Se han eliminado los siguientes renglones de armamento con los siguientes ids: ${ids}`
  )
  revalidatePath('/dashboard/armamento/inventario')

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

export const getAllItems = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const renglones = await prisma.renglon.findMany({
    where: {
      servicio: 'Armamento',
    },
    include: {
      recepciones: {
        include: {
          seriales: {
            include: {
              renglon: true,
            },
          },
        },
      },
      despachos: {
        include: {
          seriales: {
            include: {
              renglon: true,
            },
          },
        },
      },
      devoluciones: {
        include: {
          seriales: {
            include: {
              renglon: true,
            },
          },
        },
      },
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
      categoria: true,
      unidad_empaque: true,
    },
  })

  if (!renglon) {
    throw new Error('El renglon no existe')
  }
  return renglon
}
