/*
  Warnings:

  - You are about to drop the column `categoria` on the `Renglones` table. All the data in the column will be lost.
  - You are about to drop the column `clasificacion` on the `Renglones` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_empaque` on the `Renglones` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Renglones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clasificacionId` to the `Renglones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadEmpaqueId` to the `Renglones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Renglones" DROP COLUMN "categoria",
DROP COLUMN "clasificacion",
DROP COLUMN "unidad_empaque",
ADD COLUMN     "categoriaId" INTEGER NOT NULL,
ADD COLUMN     "clasificacionId" INTEGER NOT NULL,
ADD COLUMN     "unidadEmpaqueId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Clasificacion";

-- DropEnum
DROP TYPE "UnidadEmpaque";

-- CreateTable
CREATE TABLE "UnidadEmpaque" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "UnidadEmpaque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clasificacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Clasificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnidadEmpaque_nombre_key" ON "UnidadEmpaque"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Clasificacion_nombre_key" ON "Clasificacion"("nombre");

-- AddForeignKey
ALTER TABLE "Renglones" ADD CONSTRAINT "Renglones_unidadEmpaqueId_fkey" FOREIGN KEY ("unidadEmpaqueId") REFERENCES "UnidadEmpaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renglones" ADD CONSTRAINT "Renglones_clasificacionId_fkey" FOREIGN KEY ("clasificacionId") REFERENCES "Clasificacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renglones" ADD CONSTRAINT "Renglones_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
