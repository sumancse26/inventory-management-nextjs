-- CreateEnum
CREATE TYPE "collectionType" AS ENUM ('full', 'partial');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "collection_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "collection_type" "collectionType" NOT NULL DEFAULT 'full';
