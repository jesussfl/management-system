/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Renglones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Renglones_nombre_key" ON "Renglones"("nombre");
