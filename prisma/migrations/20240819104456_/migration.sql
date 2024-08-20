-- CreateTable
CREATE TABLE `CommandeModels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adresseLivraison` VARCHAR(255) NULL,
    `dateDeCommand` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modelID` INTEGER NOT NULL,
    `postId` INTEGER NULL,
    `storyId` INTEGER NULL,
    `userId` INTEGER NOT NULL,

    INDEX `modelID`(`modelID`),
    INDEX `postId`(`postId`),
    INDEX `storyId`(`storyId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `postId`(`postId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dislikes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    INDEX `postId`(`postId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `postId`(`postId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Followers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `followerId` INTEGER NOT NULL,

    UNIQUE INDEX `Followers_followerId_key`(`followerId`),
    INDEX `followerId`(`followerId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `postId`(`postId`),
    INDEX `userId`(`userId`),
    UNIQUE INDEX `Likes_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListeSouhaits` (
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    INDEX `postId`(`postId`),
    PRIMARY KEY (`userId`, `postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MesModels` (
    `userId` INTEGER NOT NULL,
    `modelId` INTEGER NOT NULL,

    INDEX `modelId`(`modelId`),
    PRIMARY KEY (`userId`, `modelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Models` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenu` JSON NULL,
    `libelle` VARCHAR(255) NULL,
    `prix` INTEGER NULL,
    `quantite` INTEGER NULL,
    `tailleurID` INTEGER NOT NULL,

    INDEX `tailleurID`(`tailleurID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `sharedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `postId`(`postId`),
    INDEX `receiverId`(`receiverId`),
    INDEX `senderId`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datePublication` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `description` TEXT NULL,
    `modelId` INTEGER NOT NULL,
    `titre` VARCHAR(255) NULL,
    `utilisateurId` INTEGER NOT NULL,
    `vues` INTEGER NULL DEFAULT 0,

    INDEX `modelId`(`modelId`),
    INDEX `utilisateurId`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expiresAt` DATETIME(0) NULL,
    `modelId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `Views` INTEGER NOT NULL DEFAULT 0,

    INDEX `modelId`(`modelId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `nom` VARCHAR(255) NULL,
    `prenom` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `photoProfile` VARCHAR(255) NULL,
    `role` ENUM('tailleur', 'visiteur', 'vendeur') NULL,
    `status` VARCHAR(50) NULL,
    `badges` BOOLEAN NULL,
    `certificat` BOOLEAN NULL,
    `credits` INTEGER NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersDiscussions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,

    INDEX `receiverId`(`receiverId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersDiscussionsMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `senderId` INTEGER NOT NULL,
    `discussionId` INTEGER NOT NULL,

    INDEX `discussionId`(`discussionId`),
    INDEX `senderId`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersMesModels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreDeCommande` INTEGER NULL,
    `modelId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `modelId`(`modelId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersNotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rate` INTEGER NULL,
    `raterID` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `raterID`(`raterID`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersNotifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `message` TEXT NULL,
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `postId`(`postId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersSignals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporterId` INTEGER NOT NULL,
    `reason` TEXT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `reporterId`(`reporterId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockedUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storyId` INTEGER NOT NULL,
    `blockedUserId` INTEGER NOT NULL,

    INDEX `blockedUserId`(`blockedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommandeModels` ADD CONSTRAINT `CommandeModels_ibfk_1` FOREIGN KEY (`modelID`) REFERENCES `Models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CommandeModels` ADD CONSTRAINT `CommandeModels_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CommandeModels` ADD CONSTRAINT `CommandeModels_ibfk_3` FOREIGN KEY (`storyId`) REFERENCES `Stories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CommandeModels` ADD CONSTRAINT `CommandeModels_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Dislikes` ADD CONSTRAINT `Dislikes_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Dislikes` ADD CONSTRAINT `Dislikes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Favoris` ADD CONSTRAINT `Favoris_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Favoris` ADD CONSTRAINT `Favoris_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Followers` ADD CONSTRAINT `Followers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Followers` ADD CONSTRAINT `Followers_ibfk_2` FOREIGN KEY (`followerId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ListeSouhaits` ADD CONSTRAINT `ListeSouhaits_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ListeSouhaits` ADD CONSTRAINT `ListeSouhaits_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MesModels` ADD CONSTRAINT `MesModels_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MesModels` ADD CONSTRAINT `MesModels_ibfk_2` FOREIGN KEY (`modelId`) REFERENCES `Models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Models` ADD CONSTRAINT `Models_ibfk_1` FOREIGN KEY (`tailleurID`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Partages` ADD CONSTRAINT `Partages_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Partages` ADD CONSTRAINT `Partages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Partages` ADD CONSTRAINT `Partages_ibfk_3` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`modelId`) REFERENCES `Models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_ibfk_2` FOREIGN KEY (`utilisateurId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Stories` ADD CONSTRAINT `Stories_ibfk_1` FOREIGN KEY (`modelId`) REFERENCES `Models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Stories` ADD CONSTRAINT `Stories_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersDiscussions` ADD CONSTRAINT `UsersDiscussions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersDiscussions` ADD CONSTRAINT `UsersDiscussions_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersDiscussionsMessages` ADD CONSTRAINT `UsersDiscussionsMessages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersDiscussionsMessages` ADD CONSTRAINT `UsersDiscussionsMessages_ibfk_2` FOREIGN KEY (`discussionId`) REFERENCES `UsersDiscussions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersMesModels` ADD CONSTRAINT `UsersMesModels_ibfk_1` FOREIGN KEY (`modelId`) REFERENCES `Models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersMesModels` ADD CONSTRAINT `UsersMesModels_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersNotes` ADD CONSTRAINT `UsersNotes_ibfk_1` FOREIGN KEY (`raterID`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersNotes` ADD CONSTRAINT `UsersNotes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersNotifications` ADD CONSTRAINT `UsersNotifications_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersNotifications` ADD CONSTRAINT `UsersNotifications_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersSignals` ADD CONSTRAINT `UsersSignals_ibfk_1` FOREIGN KEY (`reporterId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsersSignals` ADD CONSTRAINT `UsersSignals_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BlockedUsers` ADD CONSTRAINT `BlockedUsers_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `Stories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BlockedUsers` ADD CONSTRAINT `BlockedUsers_ibfk_2` FOREIGN KEY (`blockedUserId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
