/*
  Warnings:

  - The primary key for the `recibimientos_detalles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_sistema` on the `recibimientos_detalles` table. All the data in the column will be lost.
  - You are about to drop the column `id_subsistema` on the `recibimientos_detalles` table. All the data in the column will be lost.
  - The `id` column on the `recibimientos_detalles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `recibimientos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fecha_fabricacion` to the `recibimientos_detalles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_vencimiento` to the `recibimientos_detalles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentacion` to the `recibimientos_detalles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id_recibimiento` on the `recibimientos_detalles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_renglon` on the `recibimientos_detalles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "devoluciones" DROP CONSTRAINT "devoluciones_id_recibimiento_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_id_recibimiento_fkey";

-- AlterTable
ALTER TABLE "devoluciones" ADD COLUMN     "recibimientosId" INTEGER;

-- AlterTable
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_pkey",
DROP COLUMN "id_sistema",
DROP COLUMN "id_subsistema",
ADD COLUMN     "fecha_fabricacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "presentacion" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "id_recibimiento",
ADD COLUMN     "id_recibimiento" INTEGER NOT NULL,
DROP COLUMN "id_renglon",
ADD COLUMN     "id_renglon" INTEGER NOT NULL,
ADD CONSTRAINT "recibimientos_detalles_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "recibimientos";

-- CreateTable
CREATE TABLE "Recibimientos" (
    "id" SERIAL NOT NULL,
    "fecha_recibimiento" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,

    CONSTRAINT "Recibimientos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_id_recibimiento_fkey" FOREIGN KEY ("id_recibimiento") REFERENCES "Recibimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "Renglones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_recibimientosId_fkey" FOREIGN KEY ("recibimientosId") REFERENCES "Recibimientos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
