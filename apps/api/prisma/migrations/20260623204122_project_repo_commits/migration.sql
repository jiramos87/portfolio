-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "repoCommits" JSONB,
ADD COLUMN     "repoCommitsAt" TIMESTAMP(3);
