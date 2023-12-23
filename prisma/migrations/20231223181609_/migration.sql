/*
  Warnings:

  - You are about to drop the `renglones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sistemas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subsistemas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "despachos_detalles" DROP CONSTRAINT "despachos_detalles_id_renglon_fkey";

-- DropForeignKey
ALTER TABLE "despachos_detalles" DROP CONSTRAINT "despachos_detalles_id_sistema_fkey";

-- DropForeignKey
ALTER TABLE "despachos_detalles" DROP CONSTRAINT "despachos_detalles_id_subsistema_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_id_renglon_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_id_sistema_fkey";

-- DropForeignKey
ALTER TABLE "recibimientos_detalles" DROP CONSTRAINT "recibimientos_detalles_id_subsistema_fkey";

-- DropForeignKey
ALTER TABLE "renglones" DROP CONSTRAINT "renglones_id_almacen_fkey";

-- DropForeignKey
ALTER TABLE "sistemas" DROP CONSTRAINT "sistemas_id_almacen_fkey";

-- DropForeignKey
ALTER TABLE "subsistemas" DROP CONSTRAINT "subsistemas_id_almacen_fkey";

-- AlterTable
ALTER TABLE "despachos_detalles" ADD COLUMN     "sistemasId" TEXT,
ADD COLUMN     "subsistemasId" TEXT;

-- AlterTable
ALTER TABLE "recibimientos_detalles" ADD COLUMN     "sistemasId" TEXT,
ADD COLUMN     "subsistemasId" TEXT;

-- DropTable
DROP TABLE "renglones";

-- DropTable
DROP TABLE "sistemas";

-- DropTable
DROP TABLE "subsistemas";

-- CreateTable
CREATE TABLE "Sistemas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "id_almacen" INTEGER NOT NULL,

    CONSTRAINT "Sistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subsistemas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "sistema" TEXT NOT NULL,
    "id_almacen" INTEGER NOT NULL,

    CONSTRAINT "Subsistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Renglones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "presentacion" TEXT NOT NULL,
    "numero_parte" TEXT NOT NULL,
    "unidad_de_medida" TEXT NOT NULL,

    CONSTRAINT "Renglones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sistemas" ADD CONSTRAINT "Sistemas_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subsistemas" ADD CONSTRAINT "Subsistemas_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_sistemasId_fkey" FOREIGN KEY ("sistemasId") REFERENCES "Sistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_subsistemasId_fkey" FOREIGN KEY ("subsistemasId") REFERENCES "Subsistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_sistemasId_fkey" FOREIGN KEY ("sistemasId") REFERENCES "Sistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_subsistemasId_fkey" FOREIGN KEY ("subsistemasId") REFERENCES "Subsistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
