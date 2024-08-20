/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Stories` DROP FOREIGN KEY `Stories_ibfk_2`;

-- CreateIndex
CREATE UNIQUE INDEX `Likes_userId_postId_key` ON `Likes`(`userId`, `postId`);

-- AddForeignKey
ALTER TABLE `Stories` ADD CONSTRAINT `Stories_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
