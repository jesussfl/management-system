'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  Categoria_Militar,
  Componente_Militar,
  Grado_Militar,
  Prisma,
  Unidad_Militar,
} from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createComponent = async (data: Omit<Componente_Militar, 'id'>) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
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
    }
  }

  await prisma.componente_Militar.create({
    data,
  })
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Component created successfully',
  }
}
export const createGrade = async (
  data: Omit<
    Prisma.Grado_MilitarGetPayload<{
      include: {
        componentes: true
      }
    }>,
    'id'
  >
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
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
      error: 'Component already exists',
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
  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Grade created successfully',
  }
}
export const createUnit = async (data: Omit<Unidad_Militar, 'id'>) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
    }
  }

  const exists = await prisma.unidad_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'Component already exists',
    }
  }

  await prisma.unidad_Militar.create({
    data,
  })
}

export const updateComponent = async (
  id: number,
  data: Omit<Componente_Militar, 'id'>
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
      field: 'nombre',
    }
  }

  const exists = await prisma.componente_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Component not found',
    }
  }

  await prisma.componente_Militar.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Component updated successfully',
  }
}

export const updateGrade = async (
  id: number,
  data: Omit<
    Prisma.Grado_MilitarGetPayload<{
      include: {
        componentes: true
      }
    }>,
    'id'
  >
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const exists = await prisma.grado_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Grade not found',
      field: 'nombre',
    }
  }
  console.log(data)
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

  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Grade updated successfully',
  }
}
export const updateCategory = async (
  id: number,
  data: Omit<
    Prisma.Categoria_MilitarGetPayload<{ include: { grados: true } }>,
    'id'
  >
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
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

  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Category actualizada exitosamente',
  }
}
export const deleteComponent = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.componente_Militar.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Component deleted successfully',
  }
}
export const deleteCategory = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.categoria_Militar.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Category deleted successfully',
  }
}
export const deleteGrade = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  await prisma.grado_Militar.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/abastecimiento/destinatarios')

  return {
    success: 'Grade deleted successfully',
  }
}

export const createCategory = async (
  data: Omit<
    Prisma.Categoria_MilitarGetPayload<{ include: { grados: true } }>,
    'id'
  >
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const { nombre } = data
  if (!nombre) {
    return {
      error: 'Name is required',
      field: 'nombre',
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

  revalidatePath('/dashboard/abastecimiento/destinatarios')
  return {
    success: 'Category created successfully',
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
      componentes: true,
    },
  })

  if (!grade) {
    throw new Error('Grade not found')
  }

  return grade
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
      grados: true,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  return category
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
