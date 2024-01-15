/*
  Warnings:

  - You are about to drop the column `rol_id` on the `Permiso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_rol_id_fkey";

-- AlterTable
ALTER TABLE "Permiso" DROP COLUMN "rol_id";

-- CreateTable
CREATE TABLE "Roles_Permisos" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,

    CONSTRAINT "Roles_Permisos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Roles_Permisos" ADD CONSTRAINT "Roles_Permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_Permisos" ADD CONSTRAINT "Roles_Permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "Permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
