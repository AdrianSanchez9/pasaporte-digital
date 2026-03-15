/*
  Warnings:

  - You are about to drop the `_contactopacientetopaciente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_contactopacientetopaciente` DROP FOREIGN KEY `_ContactoPacienteToPaciente_A_fkey`;

-- DropForeignKey
ALTER TABLE `_contactopacientetopaciente` DROP FOREIGN KEY `_ContactoPacienteToPaciente_B_fkey`;

-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `religion` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_contactopacientetopaciente`;

-- AddForeignKey
ALTER TABLE `ContactoPaciente` ADD CONSTRAINT `ContactoPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
