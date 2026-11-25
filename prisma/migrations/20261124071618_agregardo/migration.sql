/*
  Warnings:

  - You are about to alter the column `materia` on the `tarea` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - A unique constraint covering the columns `[telefono]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carrera` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semestre` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turno` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universidad` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tarea` MODIFY `materia` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `carrera` VARCHAR(191) NOT NULL,
    ADD COLUMN `semestre` INTEGER NOT NULL,
    ADD COLUMN `telefono` VARCHAR(191) NOT NULL,
    ADD COLUMN `turno` ENUM('MATUTINO', 'VESPERTINO') NOT NULL,
    ADD COLUMN `universidad` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Examen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `materia` VARCHAR(191) NOT NULL,
    `fecha` DATE NOT NULL,
    `hora` TIME(0) NOT NULL,
    `aula` VARCHAR(191) NOT NULL,
    `temasEvaluar` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `mensaje` VARCHAR(191) NOT NULL,
    `leida` BOOLEAN NOT NULL DEFAULT false,
    `usuarioId` INTEGER NOT NULL,
    `tareaId` INTEGER NULL,
    `examenId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_telefono_key` ON `Usuario`(`telefono`);

-- AddForeignKey
ALTER TABLE `Examen` ADD CONSTRAINT `Examen_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_tareaId_fkey` FOREIGN KEY (`tareaId`) REFERENCES `Tarea`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_examenId_fkey` FOREIGN KEY (`examenId`) REFERENCES `Examen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
