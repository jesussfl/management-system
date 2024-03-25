/*
  Warnings:

  - Made the column `id_grado` on table `Grados_Componentes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_componente` on table `Grados_Componentes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Grados_Componentes" ALTER COLUMN "id_grado" SET NOT NULL,
ALTER COLUMN "id_componente" SET NOT NULL;
