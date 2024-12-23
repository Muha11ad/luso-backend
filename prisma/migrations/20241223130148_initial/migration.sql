/*
  Warnings:

  - You are about to drop the column `imageUrl_1` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl_2` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl_3` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageUrl_1",
DROP COLUMN "imageUrl_2",
DROP COLUMN "imageUrl_3";

-- CreateTable
CREATE TABLE "ProductImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
