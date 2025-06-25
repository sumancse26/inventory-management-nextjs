/*
  Warnings:

  - You are about to drop the column `available_stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "available_stock",
DROP COLUMN "qty",
DROP COLUMN "unit",
ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unit_price" VARCHAR(50) NOT NULL DEFAULT '0',
ADD COLUMN     "uom" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "uom_name" TEXT NOT NULL DEFAULT 'PC',
ADD COLUMN     "vat_pct" INTEGER NOT NULL DEFAULT 0;
