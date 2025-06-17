/*
  Warnings:

  - You are about to drop the column `vat` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "vat",
ADD COLUMN     "vat_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vat_pct" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "available_stock" INTEGER NOT NULL DEFAULT 0;
