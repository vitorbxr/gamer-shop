/*
  Warnings:

  - You are about to drop the column `brand` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `brand`,
    DROP COLUMN `category`;
