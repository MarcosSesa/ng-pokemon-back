-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "setId" TEXT NOT NULL,
    CONSTRAINT "Cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cards_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set" ("setId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cards" ("id", "setId", "userId") SELECT "id", "setId", "userId" FROM "Cards";
DROP TABLE "Cards";
ALTER TABLE "new_Cards" RENAME TO "Cards";
PRAGMA foreign_key_check("Cards");
PRAGMA foreign_keys=ON;
