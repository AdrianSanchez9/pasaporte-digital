-- CreateTable
CREATE TABLE `CuidadoPersonal` (
    `id` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `tipoMovilidad` VARCHAR(191) NULL,
    `cuidadoPersonal` TEXT NULL,
    `maneraParaComer` TEXT NULL,
    `maneraParaBeber` TEXT NULL,
    `miSeguridad` TEXT NULL,
    `usoBano` TEXT NULL,
    `rutinaDescanso` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CuidadoPersonal_pacienteId_key`(`pacienteId`),
    INDEX `CuidadoPersonal_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PerfilComunicacion` (
    `id` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `asistenteComunicacion` VARCHAR(191) NULL,
    `ayudaComunicacion` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PerfilComunicacion_pacienteId_key`(`pacienteId`),
    INDEX `PerfilComunicacion_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Emociones` (
    `id` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `descripcionAnsioso` TEXT NULL,
    `descripcionDolor` TEXT NULL,
    `descripcionAsustado` TEXT NULL,
    `descripcionEnojado` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Emociones_pacienteId_key`(`pacienteId`),
    INDEX `Emociones_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GustoPaciente` (
    `id` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NULL,
    `descripcion` TEXT NULL,
    `notas` TEXT NULL,
    `sitios` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GustoPaciente_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Paciente_userId_idx` ON `Paciente`(`userId`);

-- AddForeignKey
ALTER TABLE `CuidadoPersonal` ADD CONSTRAINT `CuidadoPersonal_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerfilComunicacion` ADD CONSTRAINT `PerfilComunicacion_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emociones` ADD CONSTRAINT `Emociones_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GustoPaciente` ADD CONSTRAINT `GustoPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
