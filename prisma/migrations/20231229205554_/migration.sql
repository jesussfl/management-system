-- CreateTable
CREATE TABLE "Stocks" (
    "id" SERIAL NOT NULL,
    "id_renglon" INTEGER NOT NULL,

    CONSTRAINT "Stocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stocks" ADD CONSTRAINT "Stocks_id_renglon_fkey" FOREIGN KEY ("id_renglon") REFERENCES "Renglones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
