import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const globalForPrismita = globalForPrisma.prisma

const prismita = new PrismaClient({
  log: ['info', 'warn', 'error'],
})

export const prisma = globalForPrismita || prismita

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// import { Prisma, PrismaClient } from '@prisma/client'
// import { Pool } from 'pg'
// import { PrismaPg } from '@prisma/adapter-pg'
