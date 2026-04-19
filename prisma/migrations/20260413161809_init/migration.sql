-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `rolId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_rolId_idx`(`rolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_nombre_key`(`nombre`),
    INDEX `Role_nombre_idx`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` VARCHAR(191) NOT NULL,
    `accion` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `modulo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Permission_accion_key`(`accion`),
    INDEX `Permission_accion_idx`(`accion`),
    INDEX `Permission_modulo_idx`(`modulo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,

    INDEX `RolePermission_roleId_idx`(`roleId`),
    INDEX `RolePermission_permissionId_idx`(`permissionId`),
    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paciente` (
    `userId` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NULL,
    `apodo` VARCHAR(191) NULL,
    `nroObraSocial` VARCHAR(191) NULL,
    `fechaNacimiento` DATETIME(3) NULL,
    `direccion` TEXT NULL,
    `telefono` VARCHAR(191) NULL,
    `medicoCabeceraId` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NULL,
    `necesidadesReligiosas` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Paciente_userId_idx`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactoPaciente` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `direccion` TEXT NULL,
    `relacion` VARCHAR(191) NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactoPaciente_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicoCabecera` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `direccion` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MedicoCabecera_nombre_idx`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medico` (
    `userId` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Acompanante` (
    `userId` VARCHAR(191) NOT NULL,
    `pacienteId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Acompanante_pacienteId_idx`(`pacienteId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(512) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    INDEX `RefreshToken_userId_idx`(`userId`),
    INDEX `RefreshToken_token_idx`(`token`),
    INDEX `RefreshToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paciente` ADD CONSTRAINT `Paciente_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paciente` ADD CONSTRAINT `Paciente_medicoCabeceraId_fkey` FOREIGN KEY (`medicoCabeceraId`) REFERENCES `MedicoCabecera`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactoPaciente` ADD CONSTRAINT `ContactoPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medico` ADD CONSTRAINT `Medico_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acompanante` ADD CONSTRAINT `Acompanante_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acompanante` ADD CONSTRAINT `Acompanante_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionMedicamento` ADD CONSTRAINT `InformacionMedicamento_historialId_fkey` FOREIGN KEY (`historialId`) REFERENCES `HistorialPaciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InformacionMedicamento` ADD CONSTRAINT `InformacionMedicamento_medicamentoId_fkey` FOREIGN KEY (`medicamentoId`) REFERENCES `Medicamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialPaciente` ADD CONSTRAINT `HistorialPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Archivos_adjuntos` ADD CONSTRAINT `Archivos_adjuntos_historial_paciente_fkey` FOREIGN KEY (`historial_paciente`) REFERENCES `HistorialPaciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CuidadoPersonal` ADD CONSTRAINT `CuidadoPersonal_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerfilComunicacion` ADD CONSTRAINT `PerfilComunicacion_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emociones` ADD CONSTRAINT `Emociones_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GustoPaciente` ADD CONSTRAINT `GustoPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
