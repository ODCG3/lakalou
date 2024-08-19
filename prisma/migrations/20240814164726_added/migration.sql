-- AlterTable
ALTER TABLE `Stories` ADD COLUMN `Views` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `BlockedUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storyId` INTEGER NOT NULL,
    `blockedUserId` INTEGER NOT NULL,

    INDEX `blockedUserId`(`blockedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlockedUsers` ADD CONSTRAINT `BlockedUsers_ibfk_1` FOREIGN KEY (`storyId`) REFERENCES `Stories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BlockedUsers` ADD CONSTRAINT `BlockedUsers_ibfk_2` FOREIGN KEY (`blockedUserId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
