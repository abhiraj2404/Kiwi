-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "wallet_addr" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "batch_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interval_start" BIGINT NOT NULL,
    "interval_end" BIGINT NOT NULL,
    "amount_decimal" DECIMAL(20,8) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "x402_id" TEXT,
    "idempotency_key" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("batch_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ts" BIGINT NOT NULL,
    "seconds" DECIMAL(10,3),
    "raw_payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_addr_key" ON "users"("wallet_addr");

-- CreateIndex
CREATE UNIQUE INDEX "batches_idempotency_key_key" ON "batches"("idempotency_key");

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
