/*
  Warnings:

  - You are about to drop the column `rol_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rol_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rol_id",
ADD COLUMN     "rol_nombre" "Roles" NOT NULL DEFAULT 'USUARIO';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rol_nombre_fkey" FOREIGN KEY ("rol_nombre") REFERENCES "Rol"("rol") ON DELETE CASCADE ON UPDATE CASCADE;
