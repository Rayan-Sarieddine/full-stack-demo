/*
  Warnings:

  - The values [AVERAGE] on the enum `PriorityLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PriorityLevel_new" AS ENUM ('TOP', 'MEDIUM', 'LOW');
ALTER TABLE "todos" ALTER COLUMN "priorityLevel" TYPE "PriorityLevel_new" USING ("priorityLevel"::text::"PriorityLevel_new");
ALTER TYPE "PriorityLevel" RENAME TO "PriorityLevel_old";
ALTER TYPE "PriorityLevel_new" RENAME TO "PriorityLevel";
DROP TYPE "PriorityLevel_old";
COMMIT;
