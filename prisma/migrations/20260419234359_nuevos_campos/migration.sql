-- AlterTable
ALTER TABLE `cuidadopersonal` ADD COLUMN `problemasVistaAudicion` TEXT NULL;

-- AlterTable
ALTER TABLE `historialpaciente` ADD COLUMN `descripcionOtrasCrisis` TEXT NULL,
    ADD COLUMN `posicionAdministracion` TEXT NULL,
    ADD COLUMN `tieneOtrasCrisis` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `nacionalidad` TEXT NULL;

-- AlterTable
ALTER TABLE `perfilcomunicacion` ADD COLUMN `lenguajesQueHabla` TEXT NULL,
    ADD COLUMN `necesitaAsistente` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `necesitaPersonaApoyo` BOOLEAN NOT NULL DEFAULT false;
