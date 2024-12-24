/*
  Warnings:

  - Added the required column `product_price` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "product_price" INTEGER NOT NULL;
