-- CreateTable
CREATE TABLE `Tarea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `materia` ENUM('Calculo', 'Programacion', 'Historia', 'Electronica', 'Otra') NOT NULL,
    `fechaEntrega` DATE NOT NULL,
    `hora` TIME(0) NOT NULL,
    `prioridad` ENUM('Alta', 'Media', 'Baja') NOT NULL,
    `estado` ENUM('Pendiente', 'EnProceso', 'Completado') NOT NULL DEFAULT 'Pendiente',
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tarea` ADD CONSTRAINT `Tarea_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
