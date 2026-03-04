/*
  Warnings:

  - You are about to drop the column `matricula` on the `medico` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNac` on the `paciente` table. All the data in the column will be lost.
  - You are about to drop the `acompañante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `acompañante` DROP FOREIGN KEY `Acompañante_pacienteId_fkey`;

-- DropForeignKey
ALTER TABLE `acompañante` DROP FOREIGN KEY `Acompañante_userId_fkey`;

-- DropIndex
DROP INDEX `Medico_matricula_idx` ON `medico`;

-- DropIndex
DROP INDEX `Medico_matricula_key` ON `medico`;

-- DropIndex
DROP INDEX `Paciente_dni_idx` ON `paciente`;

-- DropIndex
DROP INDEX `Paciente_dni_key` ON `paciente`;

-- AlterTable
ALTER TABLE `medico` DROP COLUMN `matricula`;

-- AlterTable
ALTER TABLE `paciente` DROP COLUMN `fechaNac`,
    ADD COLUMN `apodo` VARCHAR(191) NULL,
    ADD COLUMN `fechaNacimiento` DATETIME(3) NULL,
    ADD COLUMN `necesidadesReligiosas` TEXT NULL,
    ADD COLUMN `nroObraSocial` VARCHAR(191) NULL,
    MODIFY `dni` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `acompañante`;

-- CreateTable
CREATE TABLE `Acompanante` (
    `userId` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Acompanante_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Acompanante` ADD CONSTRAINT `Acompanante_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acompanante` ADD CONSTRAINT `Acompanante_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
