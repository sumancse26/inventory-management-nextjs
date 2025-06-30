-- AlterEnum
ALTER TYPE "collectionType" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "invoice_products" ADD COLUMN     "product_code" VARCHAR(50) NOT NULL DEFAULT '000';

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "collection_type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "prod_code" VARCHAR(50) NOT NULL DEFAULT '0000';
