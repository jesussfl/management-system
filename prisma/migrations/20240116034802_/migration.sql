/*
  Warnings:

  - A unique constraint covering the columns `[facialID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facialID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_facialID_key" ON "User"("facialID");
