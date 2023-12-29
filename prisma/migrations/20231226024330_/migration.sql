/*
  Warnings:

  - You are about to drop the `recibimientos_detalles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_id_recibimiento_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_id_renglon_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_sistemasId_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_subsistemasId_fkey";

-- DropTable
DROP TABLE "recibimientos_detalles";

-- CreateTable
CREATE TABLE "Detalles_recibimiento" (
    "id" SERIAL NOT NULL,
    "id_recibimiento" INTEGER NOT NULL,
    "id_renglon" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "presentacion" TEXT NOT NULL,
    "fecha_fabricacion" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Detalles_recibimiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Detalles_recibimiento" ADD CONSTRAINT "Detalles_recibimiento_id_recibimiento_fkey" FOREIGN KEY ("id_recibimiento") REFERENCES "Recibimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_recibimiento" ADD CONSTRAINT "Detalles_recibimiento_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "Renglones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
