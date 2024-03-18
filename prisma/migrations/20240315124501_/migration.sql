/*
  Warnings:

  - You are about to drop the `Detalles_recibimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recibimientos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Renglones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categorias_militares` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `componentes_militares` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `despachos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `despachos_detalles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `destinatarios_militares` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `devoluciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grados_militares` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `unidades_militares` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `redis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `zodis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_clasificacion` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_categoria` to the `UnidadEmpaque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_medida` to the `UnidadEmpaque` table without a default value. This is not possible if the table is not empty.
  - Made the column `descripcion` on table `UnidadEmpaque` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Medidas" AS ENUM ('MILILITROS', 'LITROS', 'ONZAS', 'LIBRAS', 'TONELADAS', 'KILOGRAMOS', 'GRAMOS', 'UNIDADES');

-- CreateEnum
CREATE TYPE "Tipos_Cedulas" AS ENUM ('V', 'E', 'J', 'G', 'R', 'P');

-- DropForeignKey
ALTER TABLE "Detalles_recibimiento" DROP CONSTRAINT "Detalles_recibimiento_id_recibimiento_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_recibimiento" DROP CONSTRAINT "Detalles_recibimiento_id_renglon_fkey";

-- DropForeignKey
ALTER TABLE "Renglones" DROP CONSTRAINT "Renglones_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Renglones" DROP CONSTRAINT "Renglones_clasificacionId_fkey";

-- DropForeignKey
ALTER TABLE "Renglones" DROP CONSTRAINT "Renglones_unidadEmpaqueId_fkey";

-- DropForeignKey
ALTER TABLE "despachos" DROP CONSTRAINT "despachos_cedula_destinatario_fkey";

-- DropForeignKey
ALTER TABLE "despachos_detalles" DROP CONSTRAINT "despachos_detalles_id_despacho_fkey";

-- DropForeignKey
ALTER TABLE "despachos_detalles" DROP CONSTRAINT "despachos_detalles_sistemasId_fkey";

-- DropForeignKey
ALTER TABLE "despachos_detalles" DROP CONSTRAINT "despachos_detalles_subsistemasId_fkey";

-- DropForeignKey
ALTER TABLE "destinatarios_militares" DROP CONSTRAINT "destinatarios_militares_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "destinatarios_militares" DROP CONSTRAINT "destinatarios_militares_id_componente_fkey";

-- DropForeignKey
ALTER TABLE "destinatarios_militares" DROP CONSTRAINT "destinatarios_militares_id_grado_fkey";

-- DropForeignKey
ALTER TABLE "destinatarios_militares" DROP CONSTRAINT "destinatarios_militares_id_unidad_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_id_componente_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_id_grado_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_id_unidad_fkey";

-- DropForeignKey
ALTER TABLE "unidades_militares" DROP CONSTRAINT "unidades_militares_id_zodi_fkey";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "id_clasificacion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UnidadEmpaque" ADD COLUMN     "abreviacion" TEXT,
ADD COLUMN     "id_categoria" INTEGER NOT NULL,
ADD COLUMN     "peso" DECIMAL(65,30),
ADD COLUMN     "tipo_medida" "Medidas" NOT NULL,
ALTER COLUMN "descripcion" SET NOT NULL;

-- AlterTable
ALTER TABLE "personal_militar" ADD COLUMN     "categoria_MilitarId" INTEGER,
ADD COLUMN     "componente_MilitarId" INTEGER,
ADD COLUMN     "grado_MilitarId" INTEGER,
ADD COLUMN     "unidad_MilitarId" INTEGER;

-- DropTable
DROP TABLE "Detalles_recibimiento";

-- DropTable
DROP TABLE "Recibimientos";

-- DropTable
DROP TABLE "Renglones";

-- DropTable
DROP TABLE "categorias_militares";

-- DropTable
DROP TABLE "componentes_militares";

-- DropTable
DROP TABLE "despachos";

-- DropTable
DROP TABLE "despachos_detalles";

-- DropTable
DROP TABLE "destinatarios_militares";

-- DropTable
DROP TABLE "devoluciones";

-- DropTable
DROP TABLE "grados_militares";

-- DropTable
DROP TABLE "unidades_militares";

-- CreateTable
CREATE TABLE "Renglon" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT,
    "stock_minimo" INTEGER NOT NULL DEFAULT 1,
    "stock_maximo" INTEGER,
    "numero_parte" TEXT,
    "peso" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "estado" "RenglonStates" DEFAULT 'Activo',
    "unidadEmpaqueId" INTEGER NOT NULL,
    "clasificacionId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Renglon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recepcion" (
    "id" SERIAL NOT NULL,
    "fecha_recepcion" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "Recepcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recepciones_Renglones" (
    "id" SERIAL NOT NULL,
    "id_recepcion" INTEGER NOT NULL,
    "id_renglon" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "seriales_automaticos" BOOLEAN NOT NULL,
    "fabricante" TEXT,
    "precio" DOUBLE PRECISION,
    "codigo_solicitud" TEXT,
    "fecha_fabricacion" TIMESTAMP(3),
    "fecha_vencimiento" TIMESTAMP(3),

    CONSTRAINT "Recepciones_Renglones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serial" (
    "serial" TEXT NOT NULL,
    "id_recepcion" INTEGER NOT NULL,
    "estado" TEXT,
    "id_despacho" INTEGER,

    CONSTRAINT "Serial_pkey" PRIMARY KEY ("serial")
);

-- CreateTable
CREATE TABLE "Devolucion" (
    "id" SERIAL NOT NULL,
    "id_serial" TEXT NOT NULL,
    "fecha_devolucion" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,

    CONSTRAINT "Devolucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despacho" (
    "id" SERIAL NOT NULL,
    "fecha_despacho" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "cedula_destinatario" TEXT NOT NULL,

    CONSTRAINT "Despacho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despachos_Renglones" (
    "id" SERIAL NOT NULL,
    "id_renglon" INTEGER NOT NULL,
    "id_despacho" INTEGER NOT NULL,

    CONSTRAINT "Despachos_Renglones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destinatario" (
    "id" SERIAL NOT NULL,
    "tipo_cedula" "Tipos_Cedulas" NOT NULL,
    "cedula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "situacion_profesional" TEXT NOT NULL,
    "id_unidad" INTEGER,
    "id_categoria" INTEGER NOT NULL,
    "id_grado" INTEGER NOT NULL,
    "id_componente" INTEGER NOT NULL,

    CONSTRAINT "Destinatario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Componente_Militar" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT,

    CONSTRAINT "Componente_Militar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grados_Componentes" (
    "id" SERIAL NOT NULL,
    "id_grado" INTEGER,
    "id_componente" INTEGER,

    CONSTRAINT "Grados_Componentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grado_Militar" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "orden" INTEGER,
    "estado" TEXT,

    CONSTRAINT "Grado_Militar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorias_Grados" (
    "id" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_grado" INTEGER NOT NULL,

    CONSTRAINT "Categorias_Grados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria_Militar" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "estado" TEXT,

    CONSTRAINT "Categoria_Militar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidad_Militar" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "id_zodi" TEXT NOT NULL,

    CONSTRAINT "Unidad_Militar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Renglon_nombre_key" ON "Renglon"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Destinatario_cedula_key" ON "Destinatario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Componente_Militar_nombre_key" ON "Componente_Militar"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Grado_Militar_nombre_key" ON "Grado_Militar"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_Militar_nombre_key" ON "Categoria_Militar"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Unidad_Militar_nombre_key" ON "Unidad_Militar"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "redis_nombre_key" ON "redis"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "zodis_nombre_key" ON "zodis"("nombre");

-- AddForeignKey
ALTER TABLE "Renglon" ADD CONSTRAINT "Renglon_unidadEmpaqueId_fkey" FOREIGN KEY ("unidadEmpaqueId") REFERENCES "UnidadEmpaque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renglon" ADD CONSTRAINT "Renglon_clasificacionId_fkey" FOREIGN KEY ("clasificacionId") REFERENCES "Clasificacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renglon" ADD CONSTRAINT "Renglon_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnidadEmpaque" ADD CONSTRAINT "UnidadEmpaque_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_id_clasificacion_fkey" FOREIGN KEY ("id_clasificacion") REFERENCES "Clasificacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepciones_Renglones" ADD CONSTRAINT "Recepciones_Renglones_id_recepcion_fkey" FOREIGN KEY ("id_recepcion") REFERENCES "Recepcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepciones_Renglones" ADD CONSTRAINT "Recepciones_Renglones_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "Renglon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serial" ADD CONSTRAINT "Serial_id_recepcion_fkey" FOREIGN KEY ("id_recepcion") REFERENCES "Recepciones_Renglones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serial" ADD CONSTRAINT "Serial_id_despacho_fkey" FOREIGN KEY ("id_despacho") REFERENCES "Despachos_Renglones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devolucion" ADD CONSTRAINT "Devolucion_id_serial_fkey" FOREIGN KEY ("id_serial") REFERENCES "Serial"("serial") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despacho" ADD CONSTRAINT "Despacho_cedula_destinatario_fkey" FOREIGN KEY ("cedula_destinatario") REFERENCES "Destinatario"("cedula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despachos_Renglones" ADD CONSTRAINT "Despachos_Renglones_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "Renglon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despachos_Renglones" ADD CONSTRAINT "Despachos_Renglones_id_despacho_fkey" FOREIGN KEY ("id_despacho") REFERENCES "Despacho"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinatario" ADD CONSTRAINT "Destinatario_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "Unidad_Militar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinatario" ADD CONSTRAINT "Destinatario_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria_Militar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinatario" ADD CONSTRAINT "Destinatario_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "Grado_Militar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinatario" ADD CONSTRAINT "Destinatario_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "Componente_Militar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grados_Componentes" ADD CONSTRAINT "Grados_Componentes_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "Grado_Militar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grados_Componentes" ADD CONSTRAINT "Grados_Componentes_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "Componente_Militar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categorias_Grados" ADD CONSTRAINT "Categorias_Grados_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria_Militar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categorias_Grados" ADD CONSTRAINT "Categorias_Grados_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "Grado_Militar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidad_Militar" ADD CONSTRAINT "Unidad_Militar_id_zodi_fkey" FOREIGN KEY ("id_zodi") REFERENCES "zodis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_componente_MilitarId_fkey" FOREIGN KEY ("componente_MilitarId") REFERENCES "Componente_Militar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_grado_MilitarId_fkey" FOREIGN KEY ("grado_MilitarId") REFERENCES "Grado_Militar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_categoria_MilitarId_fkey" FOREIGN KEY ("categoria_MilitarId") REFERENCES "Categoria_Militar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_unidad_MilitarId_fkey" FOREIGN KEY ("unidad_MilitarId") REFERENCES "Unidad_Militar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
