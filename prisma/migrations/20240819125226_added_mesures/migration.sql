-- CreateTable
CREATE TABLE `Mesures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cou` DOUBLE NOT NULL,
    `longueurPantallon` DOUBLE NOT NULL,
    `epaule` DOUBLE NOT NULL,
    `longueurManche` DOUBLE NOT NULL,
    `hanche` DOUBLE NOT NULL,
    `poitrine` DOUBLE NOT NULL,
    `cuisse` DOUBLE NOT NULL,
    `longueur` DOUBLE NOT NULL,
    `tourBras` DOUBLE NOT NULL,
    `tourPoignet` DOUBLE NOT NULL,
    `ceintur` DOUBLE NOT NULL,
    `UserID` INTEGER NOT NULL,

    UNIQUE INDEX `Mesures_UserID_key`(`UserID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mesures` ADD CONSTRAINT `Mesures_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
