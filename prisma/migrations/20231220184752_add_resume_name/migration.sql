/*
  Warnings:

  - Added the required column `name` to the `resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resume" ADD COLUMN     "name" TEXT NOT NULL default '';

UPDATE "resume" SET "name" = 'Resume' WHERE "name" = '';

ALTER TABLE "resume" ALTER "name" DROP DEFAULT;
