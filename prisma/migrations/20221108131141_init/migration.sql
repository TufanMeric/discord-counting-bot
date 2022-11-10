-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "current_num" INTEGER NOT NULL DEFAULT 0,
    "peak_num" INTEGER NOT NULL DEFAULT 0,
    "total_ruined" INTEGER NOT NULL DEFAULT 0,
    "last_counting_user" TEXT,
    "counting_channel" TEXT NOT NULL
);
