-- CreateTable
CREATE TABLE "SpaceUser" (
    "id" SERIAL NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SpaceUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpaceUser" ADD CONSTRAINT "SpaceUser_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceUser" ADD CONSTRAINT "SpaceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
