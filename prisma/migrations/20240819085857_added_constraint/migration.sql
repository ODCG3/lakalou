/*
  Warnings:

  - A unique constraint covering the columns `[followerId]` on the table `Followers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Followers_followerId_key` ON `Followers`(`followerId`);

-- CreateIndex
CREATE UNIQUE INDEX `Likes_userId_postId_key` ON `Likes`(`userId`, `postId`);
