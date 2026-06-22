-- CreateEnum
CREATE TYPE "ProjectKind" AS ENUM ('WEB_APP', 'TOOLING', 'CASE_STUDY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('LIVE', 'IN_PROGRESS', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "stack" TEXT[],
    "toolsUsed" TEXT[],
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "repoPublic" BOOLEAN NOT NULL DEFAULT true,
    "prdUrl" TEXT,
    "prd" TEXT,
    "buildStory" TEXT,
    "metrics" JSONB,
    "timeline" JSONB,
    "screenshots" TEXT[],
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "kind" "ProjectKind" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "shippedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitySnapshot" (
    "id" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalContribs" INTEGER NOT NULL,
    "calendar" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "repoStats" JSONB NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'github',
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivitySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_featured_sortOrder_idx" ON "Project"("featured", "sortOrder");

-- CreateIndex
CREATE INDEX "ActivitySnapshot_capturedAt_idx" ON "ActivitySnapshot"("capturedAt");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
