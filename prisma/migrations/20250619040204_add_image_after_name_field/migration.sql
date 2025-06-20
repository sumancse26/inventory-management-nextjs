-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "img_url" DROP NOT NULL,
ALTER COLUMN "img_url" SET DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" VARCHAR(100) DEFAULT '';
