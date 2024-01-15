/*
  Warnings:

  - The `rol_nombre` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `rol` on the `Rol` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rol_nombre_fkey";

-- AlterTable
ALTER TABLE "Rol" DROP COLUMN "rol",
ADD COLUMN     "rol" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rol_nombre",
ADD COLUMN     "rol_nombre" TEXT NOT NULL DEFAULT 'Basico';

-- CreateIndex
CREATE UNIQUE INDEX "Rol_rol_key" ON "Rol"("rol");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rol_nombre_fkey" FOREIGN KEY ("rol_nombre") REFERENCES "Rol"("rol") ON DELETE CASCADE ON UPDATE CASCADE;
