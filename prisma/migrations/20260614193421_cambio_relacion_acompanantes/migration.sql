-- DropForeignKey
ALTER TABLE `acompanante` DROP FOREIGN KEY `Acompanante_pacienteId_fkey`;

-- AlterTable
ALTER TABLE `acompanante` MODIFY `pacienteId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Acompanante` ADD CONSTRAINT `Acompanante_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
