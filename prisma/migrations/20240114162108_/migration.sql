/*
  Warnings:

  - The primary key for the `Permiso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Permiso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Rol` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Rol` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rol_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `rol_id` on the `Permiso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rol_id_fkey";

-- AlterTable
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "rol_id",
ADD COLUMN     "rol_id" INTEGER NOT NULL,
ADD CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Rol" DROP CONSTRAINT "Rol_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "rol" DROP DEFAULT,
ADD CONSTRAINT "Rol_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rol_id",
ADD COLUMN     "rol_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
