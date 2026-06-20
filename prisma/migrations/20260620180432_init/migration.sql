-- CreateTable
CREATE TABLE `anio_fiscal` (
    `id_anio_fiscal` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NOT NULL,
    `estado` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_anio_fiscal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_caja` (
    `id_tipo_caja` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `codigo` VARCHAR(20) NULL,
    `estado` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_tipo_caja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `caja` (
    `id_caja` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tipo_caja` INTEGER NOT NULL,
    `id_anio_fiscal` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_caja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apertura_cierre_caja` (
    `id_apertura` INTEGER NOT NULL AUTO_INCREMENT,
    `id_caja` INTEGER NOT NULL,
    `fecha_apertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_cierre` DATETIME(3) NULL,
    `monto_inicial` DECIMAL(18, 2) NOT NULL,
    `monto_final` DECIMAL(18, 2) NULL,
    `observacion` VARCHAR(500) NULL,
    `estado` ENUM('ABIERTO', 'CERRADO') NOT NULL DEFAULT 'ABIERTO',
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_apertura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_movimiento_caja` (
    `id_tipo_movimiento` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_tipo_movimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimiento_caja` (
    `id_movimiento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_caja` INTEGER NOT NULL,
    `id_tipo_movimiento` INTEGER NOT NULL,
    `monto` DECIMAL(18, 2) NOT NULL,
    `motivo` VARCHAR(500) NULL,
    `fecha_movimiento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_movimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transferencia_caja` (
    `id_transferencia` INTEGER NOT NULL AUTO_INCREMENT,
    `id_caja_envio` INTEGER NOT NULL,
    `id_caja_recepcion` INTEGER NOT NULL,
    `monto` DECIMAL(18, 2) NOT NULL,
    `estado` ENUM('PENDIENTE', 'ACEPTADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    `observacion` VARCHAR(500) NULL,
    `fecha_transferencia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_transferencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `caja` ADD CONSTRAINT `caja_id_tipo_caja_fkey` FOREIGN KEY (`id_tipo_caja`) REFERENCES `tipo_caja`(`id_tipo_caja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caja` ADD CONSTRAINT `caja_id_anio_fiscal_fkey` FOREIGN KEY (`id_anio_fiscal`) REFERENCES `anio_fiscal`(`id_anio_fiscal`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apertura_cierre_caja` ADD CONSTRAINT `apertura_cierre_caja_id_caja_fkey` FOREIGN KEY (`id_caja`) REFERENCES `caja`(`id_caja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimiento_caja` ADD CONSTRAINT `movimiento_caja_id_caja_fkey` FOREIGN KEY (`id_caja`) REFERENCES `caja`(`id_caja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimiento_caja` ADD CONSTRAINT `movimiento_caja_id_tipo_movimiento_fkey` FOREIGN KEY (`id_tipo_movimiento`) REFERENCES `tipo_movimiento_caja`(`id_tipo_movimiento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferencia_caja` ADD CONSTRAINT `transferencia_caja_id_caja_envio_fkey` FOREIGN KEY (`id_caja_envio`) REFERENCES `caja`(`id_caja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferencia_caja` ADD CONSTRAINT `transferencia_caja_id_caja_recepcion_fkey` FOREIGN KEY (`id_caja_recepcion`) REFERENCES `caja`(`id_caja`) ON DELETE RESTRICT ON UPDATE CASCADE;
