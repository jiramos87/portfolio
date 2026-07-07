-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "CorpusChunk" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "section" TEXT,
    "content" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "embedding" vector(768) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorpusChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CorpusChunk_source_idx" ON "CorpusChunk"("source");

-- CreateIndex
CREATE INDEX "CorpusChunk_embedding_hnsw_idx" ON "CorpusChunk" USING hnsw ("embedding" vector_cosine_ops);
