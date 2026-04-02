-- CreateTable
CREATE TABLE `Archivos_adjuntos` (
    `UniqueID` VARCHAR(191) NOT NULL,
    `nombre_archivo` VARCHAR(191) NOT NULL,
    `UUID` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `fecha_carga` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `historial_paciente` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UniqueID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Archivos_adjuntos` ADD CONSTRAINT `Archivos_adjuntos_historial_paciente_fkey` FOREIGN KEY (`historial_paciente`) REFERENCES `HistorialPaciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
