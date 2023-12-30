-- DropForeignKey
ALTER TABLE "Detalles_recibimiento" DROP CONSTRAINT "Detalles_recibimiento_id_recibimiento_fkey";

-- AddForeignKey
ALTER TABLE "Detalles_recibimiento" ADD CONSTRAINT "Detalles_recibimiento_id_recibimiento_fkey" FOREIGN KEY ("id_recibimiento") REFERENCES "Recibimientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
