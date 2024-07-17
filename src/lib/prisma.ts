// import { PrismaClient } from '@prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'
// // PrismaClient is attached to the `global` object in development to prevent
// // exhausting your database connection limit.
// //
// // Learn more:
// // https://pris.ly/d/help/next-js-best-practices

// const globalForPrisma = global as unknown as { prisma: PrismaClient }
// const globalForPrismita = globalForPrisma.prisma

// const prismita = new PrismaClient({
//   log: ['info', 'warn', 'error'],
// })
// .$extends({
//   model: {
//     proveedor: {
//       async delete({ where }: { where: { id: number } }) {
//         return prismita.proveedor.update({
//           where: {
//             ...where,
//           },
//           data: {
//             fecha_eliminacion: new Date(),
//           },
//         })
//       },
//     },
//   },
//   query: {
//     proveedor: {
//       async $allOperations({ model, operation, args, query }) {
//         if (operation === 'findUnique' || operation === 'findMany') {
//           args.where = {
//             ...args.where,
//             fecha_eliminacion: null,
//           }
//           return query(args)
//         }
//       },
//     },
//   },
// })
// export const prisma = globalForPrismita || prismita.$extends(withAccelerate())

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// import { Prisma, PrismaClient } from '@prisma/client'
// import { Pool } from 'pg'
// import { PrismaPg } from '@prisma/adapter-pg'
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
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (operation === 'findUnique' || operation === 'findMany') {
            // Agregar condición sólo si no está especificada por el usuario
            if (args.where && !('fecha_eliminacion' in args.where)) {
              args.where = {
                ...args.where,
                fecha_eliminacion: null,
              }
            }
            return query(args)
          }
          return query(args)
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
