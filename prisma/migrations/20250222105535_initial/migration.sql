/*
  Warnings:

  - You are about to drop the column `skintype` on the `Recommendation` table. All the data in the column will be lost.
  - The primary key for the `RecommendationProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `RecommendationProduct` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationId` on the `RecommendationProduct` table. All the data in the column will be lost.
  - Added the required column `skin_type` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `RecommendationProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendation_id` to the `RecommendationProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecommendationProduct" DROP CONSTRAINT "RecommendationProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "RecommendationProduct" DROP CONSTRAINT "RecommendationProduct_recommendationId_fkey";

-- AlterTable
ALTER TABLE "Recommendation" DROP COLUMN "skintype",
ADD COLUMN     "skin_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RecommendationProduct" DROP CONSTRAINT "RecommendationProduct_pkey",
DROP COLUMN "productId",
DROP COLUMN "recommendationId",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "recommendation_id" TEXT NOT NULL,
ADD CONSTRAINT "RecommendationProduct_pkey" PRIMARY KEY ("recommendation_id", "product_id");

-- AddForeignKey
ALTER TABLE "RecommendationProduct" ADD CONSTRAINT "RecommendationProduct_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationProduct" ADD CONSTRAINT "RecommendationProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
