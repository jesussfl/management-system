-- CreateEnum
CREATE TYPE "Clasificacion" AS ENUM ('REPUESTOS', 'ARTICULOS_OFICINA', 'LIQUIDOS', 'EQUIPAMIENTO_MILITAR', 'MATERIALES_CONSTRUCCION', 'ALIMENTOS', 'OTRO');

-- CreateEnum
CREATE TYPE "UnidadEmpaque" AS ENUM ('CAJA', 'BARRIL', 'BIDON', 'BOTELLA', 'BOLSA_HERMETICA', 'CONTENEDOR_PLASTICO', 'ESTUCHE', 'BANDEJA', 'CAJA_ARCHIVADOR', 'SOBRE', 'CONTENEDOR_ESPECIAL', 'ESTUCHE_TRANSPORTE', 'BOLSA_SELLADA', 'FUNDA_PROTECCION', 'CONTENEDOR_SELLADO', 'BOLSA_VACIO', 'OTRO');

-- CreateEnum
CREATE TYPE "RenglonStates" AS ENUM ('Activo', 'Eliminado', 'En Borrador', 'Deshabilitado');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rol_nombre" TEXT NOT NULL DEFAULT 'Basico',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "rol" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles_Permisos" (
    "id" SERIAL NOT NULL,
    "rol_nombre" TEXT NOT NULL,
    "permiso_key" TEXT NOT NULL,

    CONSTRAINT "Roles_Permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "permiso" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

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
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "clasificacion" "Clasificacion" NOT NULL,
    "categoria" TEXT NOT NULL,
    "tipo" TEXT,
    "unidad_empaque" "UnidadEmpaque" NOT NULL,
    "stock_minimo" INTEGER NOT NULL DEFAULT 1,
    "stock_maximo" INTEGER,
    "numero_parte" TEXT,
    "estado" "RenglonStates" DEFAULT 'Activo',

    CONSTRAINT "Renglones_pkey" PRIMARY KEY ("id")
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
    "sistemasId" TEXT,
    "subsistemasId" TEXT,

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
CREATE TABLE "Recibimientos" (
    "id" SERIAL NOT NULL,
    "fecha_recibimiento" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "Recibimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_recibimiento" (
    "id" SERIAL NOT NULL,
    "id_recibimiento" INTEGER NOT NULL,
    "id_renglon" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha_fabricacion" TIMESTAMP(3),
    "fecha_vencimiento" TIMESTAMP(3),

    CONSTRAINT "Detalles_recibimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "id" TEXT NOT NULL,
    "id_recibimiento" TEXT NOT NULL,
    "recibimientosId" INTEGER,

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

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_rol_key" ON "Rol"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_key_key" ON "Permiso"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Renglones_nombre_key" ON "Renglones"("nombre");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rol_nombre_fkey" FOREIGN KEY ("rol_nombre") REFERENCES "Rol"("rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_Permisos" ADD CONSTRAINT "Roles_Permisos_rol_nombre_fkey" FOREIGN KEY ("rol_nombre") REFERENCES "Rol"("rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_Permisos" ADD CONSTRAINT "Roles_Permisos_permiso_key_fkey" FOREIGN KEY ("permiso_key") REFERENCES "Permiso"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sistemas" ADD CONSTRAINT "Sistemas_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subsistemas" ADD CONSTRAINT "Subsistemas_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos" ADD CONSTRAINT "despachos_cedula_destinatario_fkey" FOREIGN KEY ("cedula_destinatario") REFERENCES "destinatarios_militares"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_id_despacho_fkey" FOREIGN KEY ("id_despacho") REFERENCES "despachos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_sistemasId_fkey" FOREIGN KEY ("sistemasId") REFERENCES "Sistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos_detalles" ADD CONSTRAINT "despachos_detalles_subsistemasId_fkey" FOREIGN KEY ("subsistemasId") REFERENCES "Subsistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "grados_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "componentes_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinatarios_militares" ADD CONSTRAINT "destinatarios_militares_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades_militares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_recibimiento" ADD CONSTRAINT "Detalles_recibimiento_id_recibimiento_fkey" FOREIGN KEY ("id_recibimiento") REFERENCES "Recibimientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_recibimiento" ADD CONSTRAINT "Detalles_recibimiento_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "Renglones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
