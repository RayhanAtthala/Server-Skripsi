-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "streamLDR" DROP NOT NULL,
ALTER COLUMN "streamDist" DROP NOT NULL,
ALTER COLUMN "streamPosture" DROP NOT NULL,
ALTER COLUMN "streamRest" DROP NOT NULL;
