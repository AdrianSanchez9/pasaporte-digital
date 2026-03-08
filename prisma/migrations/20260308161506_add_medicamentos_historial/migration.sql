-- CreateTable
CREATE TABLE `Medicamento` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Medicamento_nombre_key`(`nombre`),
    INDEX `Medicamento_nombre_idx`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InformacionMedicamento` (
    `id` VARCHAR(191) NOT NULL,
    `historialId` VARCHAR(191) NOT NULL,
    `medicamentoId` VARCHAR(191) NULL,
    `medicamentoPersonalizado` VARCHAR(191) NULL,
    `dosis` VARCHAR(191) NULL,
    `horarios` VARCHAR(191) NULL,
    `formaMedicamento` VARCHAR(191) NULL,
    `tipoMedicamento` VARCHAR(191) NULL,
    `momentoIngesta` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InformacionMedicamento_historialId_idx`(`historialId`),
    INDEX `InformacionMedicamento_medicamentoId_idx`(`medicamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialPaciente` (
    `id` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `alergias` TEXT NULL,
    `metodosIntervencion` TEXT NULL,
    `metodoLiquidosSolidos` TEXT NULL,
    `datosExtras` TEXT NULL,
    `tieneEpilepsia` BOOLEAN NOT NULL DEFAULT false,
    `tipoCrisis` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HistorialPaciente_pacienteId_key`(`pacienteId`),
    INDEX `HistorialPaciente_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InformacionMedicamento` ADD CONSTRAINT `InformacionMedicamento_historialId_fkey` FOREIGN KEY (`historialId`) REFERENCES `HistorialPaciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionMedicamento` ADD CONSTRAINT `InformacionMedicamento_medicamentoId_fkey` FOREIGN KEY (`medicamentoId`) REFERENCES `Medicamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialPaciente` ADD CONSTRAINT `HistorialPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
