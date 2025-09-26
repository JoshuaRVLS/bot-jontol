-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "bank" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wallet" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");
