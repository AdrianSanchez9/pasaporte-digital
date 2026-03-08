/*
  Warnings:

  - You are about to drop the column `pacienteId` on the `medicocabecera` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `MedicoCabecera_pacienteId_idx` ON `medicocabecera`;

-- DropIndex
DROP INDEX `MedicoCabecera_pacienteId_key` ON `medicocabecera`;

-- AlterTable
ALTER TABLE `medicocabecera` DROP COLUMN `pacienteId`;

-- CreateIndex
CREATE INDEX `MedicoCabecera_nombre_idx` ON `MedicoCabecera`(`nombre`);
