-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "status" "TaskType" NOT NULL DEFAULT 'TODO',
    "created_at" DATE NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
