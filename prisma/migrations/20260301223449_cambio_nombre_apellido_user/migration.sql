/*
  Warnings:

  - You are about to drop the column `nombre` on the `medico` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `paciente` table. All the data in the column will be lost.
  - Added the required column `apellido` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Medico_nombre_idx` ON `medico`;

-- DropIndex
DROP INDEX `Paciente_nombre_idx` ON `paciente`;

-- AlterTable
ALTER TABLE `medico` DROP COLUMN `nombre`;

-- AlterTable
ALTER TABLE `paciente` DROP COLUMN `nombre`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `apellido` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL;
