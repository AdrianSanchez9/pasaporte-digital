-- DropForeignKey
ALTER TABLE `contactopaciente` DROP FOREIGN KEY `ContactoPaciente_pacienteId_fkey`;

-- DropForeignKey
ALTER TABLE `medicocabecera` DROP FOREIGN KEY `MedicoCabecera_pacienteId_fkey`;

-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `medicoCabeceraId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `_ContactoPacienteToPaciente` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ContactoPacienteToPaciente_AB_unique`(`A`, `B`),
    INDEX `_ContactoPacienteToPaciente_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Paciente` ADD CONSTRAINT `Paciente_medicoCabeceraId_fkey` FOREIGN KEY (`medicoCabeceraId`) REFERENCES `MedicoCabecera`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ContactoPacienteToPaciente` ADD CONSTRAINT `_ContactoPacienteToPaciente_A_fkey` FOREIGN KEY (`A`) REFERENCES `ContactoPaciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ContactoPacienteToPaciente` ADD CONSTRAINT `_ContactoPacienteToPaciente_B_fkey` FOREIGN KEY (`B`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
