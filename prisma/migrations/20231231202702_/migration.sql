-- CreateEnum
CREATE TYPE "RenglonStates" AS ENUM ('Activo', 'Eliminado', 'En Borrador', 'Deshabilitado');

-- AlterTable
ALTER TABLE "Renglones" ADD COLUMN     "estado" "RenglonStates" DEFAULT 'Activo';
