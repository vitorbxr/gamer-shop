/*
  Warnings:

  - You are about to drop the column `brand` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `product` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
*/

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Inserir categorias padrão
INSERT INTO `Category` (`name`) 
VALUES 
    ('Mouse'),
    ('Teclado'),
    ('Headset'),
    ('Monitor'),
    ('GPU'),
    ('Outros');

-- Inserir marcas padrão
INSERT INTO `Brand` (`name`) 
VALUES 
    ('Razer'),
    ('Logitech'),
    ('Corsair'),
    ('HyperX'),
    ('NVIDIA'),
    ('Diversos');

-- AlterTable
ALTER TABLE `product` 
    ADD COLUMN `brandId` INTEGER,
    ADD COLUMN `categoryId` INTEGER;

-- Atualizar produtos existentes
UPDATE `product` SET 
    `categoryId` = (SELECT id FROM `Category` WHERE name = 'Outros'),
    `brandId` = (SELECT id FROM `Brand` WHERE name = 'Diversos');

-- Tornar colunas NOT NULL
ALTER TABLE `product` 
    MODIFY COLUMN `brandId` INTEGER NOT NULL,
    MODIFY COLUMN `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;