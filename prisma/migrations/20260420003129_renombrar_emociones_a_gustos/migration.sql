/*
  Warnings:

  - You are about to drop the `emociones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gustopaciente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `emociones` DROP FOREIGN KEY `Emociones_pacienteId_fkey`;

-- DropForeignKey
ALTER TABLE `gustopaciente` DROP FOREIGN KEY `GustoPaciente_pacienteId_fkey`;

-- DropTable
DROP TABLE `emociones`;

-- DropTable
DROP TABLE `gustopaciente`;

-- CreateTable
CREATE TABLE `EmocionesGustos` (
    `id` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `descripcionAnsioso` TEXT NULL,
    `descripcionDolor` TEXT NULL,
    `descripcionAsustado` TEXT NULL,
    `descripcionEnojado` TEXT NULL,
    `loQueMeGusta` TEXT NULL,
    `loQueNoMeGusta` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmocionesGustos_pacienteId_key`(`pacienteId`),
    INDEX `EmocionesGustos_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmocionesGustos` ADD CONSTRAINT `EmocionesGustos_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
