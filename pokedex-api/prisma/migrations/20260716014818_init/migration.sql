/*
  Warnings:

  - A unique constraint covering the columns `[evolvesToId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "evolvesToId" TEXT;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GlobalBadge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gym" TEXT NOT NULL,

    CONSTRAINT "GlobalBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_evolvesToId_key" ON "Pokemon"("evolvesToId");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_evolvesToId_fkey" FOREIGN KEY ("evolvesToId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
