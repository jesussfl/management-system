import { Prisma, PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
  }).$extends({
    model: {
      $allModels: {
        async delete<M, A>(
          this: M,
          where: Prisma.Args<M, 'delete'>
        ): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this)

          return (context as any).update({
            ...where,
            data: {
              fecha_eliminacion: new Date(),
            },
          })
        },
      },
    },
  })

  return prisma
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
