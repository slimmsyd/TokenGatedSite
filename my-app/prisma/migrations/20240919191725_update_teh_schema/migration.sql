/*
  Warnings:

  - Made the column `videoURL` on table `Module` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "videoURL" SET NOT NULL;
