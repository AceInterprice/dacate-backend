/*
  Warnings:

  - Added the required column `turno` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `turno` ENUM('MATUTINO', 'VESPERTINO') NOT NULL;
