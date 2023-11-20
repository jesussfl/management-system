/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sistemas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "id_almacen" INTEGER NOT NULL,

    CONSTRAINT "sistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subsistemas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "sistema" TEXT NOT NULL,
    "id_almacen" INTEGER NOT NULL,

    CONSTRAINT "subsistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renglones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "presentacion" TEXT NOT NULL,
    "numero_parte" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "stock_maximo" INTEGER NOT NULL,
    "inventariable" BOOLEAN NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "id_almacen" INTEGER NOT NULL,

    CONSTRAINT "renglones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "almacenes" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,

    CONSTRAINT "almacenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despachos" (
    "id" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "cedula_destinatario" TEXT NOT NULL,

    CONSTRAINT "despachos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despachos_detalles" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_despacho" TEXT NOT NULL,
    "id_renglon" TEXT NOT NULL,
    "id_subsistema" TEXT NOT NULL,
    "id_sistema" TEXT NOT NULL,

    CONSTRAINT "despachos_detalles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinatarios_militares" (
    "cedula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "direccion_domicilio" TEXT NOT NULL,
    "id_grado" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "id_componente" TEXT NOT NULL,
    "id_unidad" TEXT NOT NULL,

    CONSTRAINT "destinatarios_militares_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "recibimientos" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,

    CONSTRAINT "recibimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recibimientos_detalles" (
    "id" TEXT NOT NULL,
    "id_recibimiento" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_renglon" TEXT NOT NULL,
    "id_subsistema" TEXT NOT NULL,
    "id_sistema" TEXT NOT NULL,

    CONSTRAINT "recibimientos_detalles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "id" TEXT NOT NULL,
    "id_recibimiento" TEXT NOT NULL,

    CONSTRAINT "devoluciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "componentes_militares" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ultima_edicion" TIMESTAMP(3) NOT NULL,
    "fecha_eliminado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "componentes_militares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grados_militares" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "ultima_edicion" TIMESTAMP(3) NOT NULL,
    "fecha_eliminado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grados_militares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_militares" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "categorias_militares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_militares" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "id_zodi" TEXT NOT NULL,

    CONSTRAINT "unidades_militares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zodis" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "id_redi" TEXT NOT NULL,

    CONSTRAINT "zodis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redis" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,

    CONSTRAINT "redis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_militar" (
    "cedula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "estado_civil" TEXT NOT NULL,
    "id_armamento" TEXT NOT NULL,
    "situacion_profesional" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "id_unidad" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "id_grado" TEXT NOT NULL,
    "id_componente" TEXT NOT NULL,

    CONSTRAINT "personal_militar_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "reposos" (
    "id" TEXT NOT NULL,

    CONSTRAINT "reposos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sistemas" ADD CONSTRAINT "sistemas_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subsistemas" ADD CONSTRAINT "subsistemas_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renglones" ADD CONSTRAINT "renglones_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos" ADD CONSTRAINT "despachos_cedula_destinatario_fkey" FOREIGN KEY ("cedula_destinatario") REFERENCES "destinatarios_militares"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_id_despacho_fkey" FOREIGN KEY ("id_despacho") REFERENCES "despachos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "renglones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_id_subsistema_fkey" FOREIGN KEY ("id_subsistema") REFERENCES "subsistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_id_sistema_fkey" FOREIGN KEY ("id_sistema") REFERENCES "sistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "grados_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "componentes_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_id_recibimiento_fkey" FOREIGN KEY ("id_recibimiento") REFERENCES "recibimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "renglones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_id_subsistema_fkey" FOREIGN KEY ("id_subsistema") REFERENCES "subsistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibimientos_detalles" ADD CONSTRAINT "recibimientos_detalles_id_sistema_fkey" FOREIGN KEY ("id_sistema") REFERENCES "sistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_id_recibimiento_fkey" FOREIGN KEY ("id_recibimiento") REFERENCES "recibimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_militares" ADD CONSTRAINT "unidades_militares_id_zodi_fkey" FOREIGN KEY ("id_zodi") REFERENCES "zodis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zodis" ADD CONSTRAINT "zodis_id_redi_fkey" FOREIGN KEY ("id_redi") REFERENCES "redis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "grados_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_militar" ADD CONSTRAINT "personal_militar_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "componentes_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
