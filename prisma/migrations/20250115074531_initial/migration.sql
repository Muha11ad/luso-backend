/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_imageUrl_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "imageUrl";
