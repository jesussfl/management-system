'use server'
import { auth } from '@/auth'
import { registerAuditAction } from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'
import {
  CreateCategoriasWithGrados,
  CreateGradosWithComponentes,
} from '@/types/types'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Componente_Militar, Prisma, Unidad_Militar } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createComponent = async (
  data: Prisma.Componente_MilitarCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
      success: false,
      field: 'nombre',
    }
  }

  const exists = await prisma.componente_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'Component already exists',
      success: false,
    }
  }

  await prisma.componente_Militar.create({
    data,
  })

  await registerAuditAction('CREAR', `Componente ${data.nombre} creado`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Component created successfully',
    error: false,
  }
}
export const createGrade = async (data: CreateGradosWithComponentes) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
      success: false,
      field: 'nombre',
    }
  }

  const exists = await prisma.grado_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      success: false,
      error: 'El grado ya existe',
    }
  }

  await prisma.grado_Militar.create({
    data: {
      ...data,
      componentes: {
        create: data.componentes.map((component) => ({
          componente: {
            connect: {
              id: component.id_componente,
            },
          },
        })),
      },
    },
  })

  await registerAuditAction('CREAR', `Grado ${data.nombre} creado`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Grade created successfully',
    error: false,
  }
}
export const createUnit = async (data: Omit<Unidad_Militar, 'id'>) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
      success: false,
    }
  }

  await prisma.unidad_Militar.create({
    data,
  })
  const exists = await prisma.unidad_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'Component already exists',
      success: false,
    }
  }

  await prisma.unidad_Militar.create({
    data,
  })

  await registerAuditAction('CREAR', `Unidad ${data.nombre} creada`)

  revalidatePath('/dashboard/unidades')
}

export const updateComponent = async (
  id: number,
  data: Prisma.Componente_MilitarUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const exists = await prisma.componente_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Component not found',
      success: false,
    }
  }

  await prisma.componente_Militar.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Componente ${data.nombre} actualizado`
  )
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    error: false,
    success: 'Component updated successfully',
  }
}

export const updateGrade = async (
  id: number,
  data: CreateGradosWithComponentes
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.grado_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Grado no encontrado',
      success: false,
    }
  }
  await prisma.grado_Militar.update({
    where: {
      id,
    },
    data: {
      ...data,
      componentes: {
        deleteMany: {},
        create: data.componentes.map((component) => ({
          id_componente: component.id_componente,
        })),
      },
    },
  })

  await registerAuditAction('ACTUALIZAR', `Grado ${data.nombre} actualizado`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    error: false,
    success: 'Grade updated successfully',
  }
}
export const updateCategory = async (
  id: number,
  data: CreateCategoriasWithGrados
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
    }
  }

  const exists = await prisma.categoria_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Category not found',
      field: 'nombre',
      success: false,
    }
  }

  await prisma.categoria_Militar.update({
    where: {
      id,
    },
    data: {
      ...data,
      grados: {
        deleteMany: {},
        create: data.grados.map((grade) => ({
          id_grado: grade.id_grado,
        })),
      },
    },
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Categoría ${data.nombre} actualizada`
  )
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Category actualizada exitosamente',
    error: false,
  }
}
export const deleteComponent = async (id: number) => {
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

  const exists = await prisma.componente_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Componente no encontrado',
      success: false,
    }
  }

  await prisma.componente_Militar.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('ELIMINAR', `Componente ${exists.nombre} eliminado`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Component deleted successfully',
    error: false,
  }
}
export const deleteCategory = async (id: number) => {
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

  const exists = await prisma.categoria_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Categoría no encontrada',
      success: false,
    }
  }
  await prisma.categoria_Militar.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('ELIMINAR', `Categoría ${exists.nombre} eliminada`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Category deleted successfully',
    error: false,
  }
}
export const deleteGrade = async (id: number) => {
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

  const exists = await prisma.grado_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Grade not found',
      success: false,
    }
  }
  await prisma.grado_Militar.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('ELIMINAR', `Grado ${exists.nombre} eliminado`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Grado eliminado exitosamente',
    error: false,
  }
}

export const createCategory = async (data: CreateCategoriasWithGrados) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
      field: 'nombre',
      success: false,
    }
  }

  const exists = await prisma.categoria_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'Component already exists',
      success: false,
    }
  }

  await prisma.categoria_Militar.create({
    data: {
      ...data,
      grados: {
        create: data.grados.map((grade) => ({
          grado: {
            connect: {
              id: grade.id_grado,
            },
          },
        })),
      },
    },
  })

  await registerAuditAction('CREAR', `Categoría ${data.nombre} creada`)
  revalidatePath('/dashboard/abastecimiento/destinatarios')
  return {
    success: 'Category created successfully',
    error: false,
  }
}
export const getAllComponents = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const components = await prisma.componente_Militar.findMany()
  return components
}

export const getAllGrades = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const grades = await prisma.grado_Militar.findMany({
    include: {
      componentes: {
        include: {
          componente: true,
        },
      },
    },
  })
  return grades
}

export const getGradesByComponentId = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const grades = await prisma.grado_Militar.findMany({
    where: {
      componentes: { some: { id_componente: id } },
    },
    include: {
      componentes: {
        include: {
          componente: true,
        },
      },
    },
  })

  return grades
}

export const getCategoriesByGradeId = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const categories = await prisma.categoria_Militar.findMany({
    where: {
      grados: { some: { id_grado: id } },
    },
  })

  return categories
}
export const getComponentById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const component = await prisma.componente_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!component) {
    throw new Error('Component not found')
  }

  return component
}
export const getGradeById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const grade = await prisma.grado_Militar.findUnique({
    where: {
      id,
    },
    include: {
      componentes: {
        include: {
          componente: true,
        },
      },
    },
  })

  if (!grade) {
    throw new Error('Grade not found')
  }

  return {
    ...grade,
    componentes: grade.componentes.map((component) => ({
      value: String(component.id_componente),
      label: component.componente.nombre,
    })),
  }
}
export const getCategoryById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const category = await prisma.categoria_Militar.findUnique({
    where: {
      id,
    },
    include: {
      grados: {
        include: {
          grado: true,
        },
      },
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  return {
    ...category,
    grados: category.grados.map((grade) => ({
      value: String(grade.id_grado),
      label: grade.grado.nombre,
    })),
  }
}
export const getAllCategories = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const categories = await prisma.categoria_Militar.findMany()
  return categories
}

export const getAllUnits = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const units = await prisma.unidad_Militar.findMany()

  return units
}
