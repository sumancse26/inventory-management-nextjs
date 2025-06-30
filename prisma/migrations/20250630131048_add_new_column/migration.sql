/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - The `unit_price` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "mrp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trade_price" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "unit_price",
ADD COLUMN     "unit_price" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "uom_name" SET DEFAULT 'Pcs';
