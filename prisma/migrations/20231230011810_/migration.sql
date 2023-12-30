/*
  Warnings:

  - You are about to drop the column `presentacion` on the `Renglones` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_de_medida` on the `Renglones` table. All the data in the column will be lost.
  - You are about to drop the `Stocks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `unidad_empaque` to the `Renglones` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `clasificacion` on the `Renglones` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Clasificacion" AS ENUM ('REPUESTOS', 'ARTICULOS_OFICINA', 'LIQUIDOS', 'EQUIPAMIENTO_MILITAR', 'MATERIALES_CONSTRUCCION', 'ALIMENTOS', 'OTRO');

-- CreateEnum
CREATE TYPE "UnidadEmpaque" AS ENUM ('CAJA', 'BARRIL', 'BIDON', 'BOTELLA', 'BOLSA_HERMETICA', 'CONTENEDOR_PLASTICO', 'ESTUCHE', 'BANDEJA', 'CAJA_ARCHIVADOR', 'SOBRE', 'CONTENEDOR_ESPECIAL', 'ESTUCHE_TRANSPORTE', 'BOLSA_SELLADA', 'FUNDA_PROTECCION', 'CONTENEDOR_SELLADO', 'BOLSA_VACIO', 'OTRO');

-- DropForeignKey
ALTER TABLE "Stocks" DROP CONSTRAINT "Stocks_id_renglon_fkey";

-- AlterTable
ALTER TABLE "Renglones" DROP COLUMN "presentacion",
DROP COLUMN "unidad_de_medida",
ADD COLUMN     "stock_maximo" INTEGER,
ADD COLUMN     "stock_minimo" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "unidad_empaque" "UnidadEmpaque" NOT NULL,
DROP COLUMN "clasificacion",
ADD COLUMN     "clasificacion" "Clasificacion" NOT NULL,
ALTER COLUMN "tipo" DROP NOT NULL,
ALTER COLUMN "numero_parte" DROP NOT NULL;

-- DropTable
DROP TABLE "Stocks";
