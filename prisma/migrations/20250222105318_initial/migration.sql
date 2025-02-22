/*
  Warnings:

  - Added the required column `age` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skintype` to the `Recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recommendation" ADD COLUMN     "age" TEXT NOT NULL,
ADD COLUMN     "skintype" TEXT NOT NULL;
