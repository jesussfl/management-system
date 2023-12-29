-- AlterTable
ALTER TABLE "Detalles_recibimiento" ALTER COLUMN "fecha_fabricacion" DROP NOT NULL,
ALTER COLUMN "fecha_vencimiento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recibimientos" ALTER COLUMN "motivo" DROP NOT NULL;
