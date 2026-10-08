-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('DESIGN', 'USER', 'REVIEW', 'MESSAGE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED', 'FLAGGED');

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_design_id_fkey";

-- DropForeignKey
ALTER TABLE "withdrawals" DROP CONSTRAINT "withdrawals_designer_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "designs" ADD COLUMN     "archived_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "design_title" TEXT,
ADD COLUMN     "preview_url" TEXT;

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "type" "ReportType" NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "moderator_id" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "user_registration" BOOLEAN NOT NULL DEFAULT true,
    "design_approval" BOOLEAN NOT NULL DEFAULT true,
    "categories" TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_status_created_at_idx" ON "reports"("status", "created_at");

-- CreateIndex
CREATE INDEX "reports_type_subject_id_idx" ON "reports"("type", "subject_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_designer_id_fkey" FOREIGN KEY ("designer_id") REFERENCES "designers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Preserve snapshots for historical purchases before requiring them on new writes.
UPDATE transactions t SET design_title = d.title, preview_url = d.watermarked_preview_url
FROM designs d WHERE t.design_id = d.id;
ALTER TABLE transactions ALTER COLUMN design_title SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN preview_url SET NOT NULL;

-- Persist configuration defaults matching the existing application behavior.
INSERT INTO site_settings (id, categories, updated_at)
VALUES (1, ARRAY['Logos','Templates','Print','UI/UX','Icons','Illustrations','UI Kits','Mockups'], NOW());
ALTER TABLE site_settings ADD CONSTRAINT site_settings_singleton CHECK (id = 1);
ALTER TABLE reports ADD CONSTRAINT reports_positive_subject CHECK (subject_id > 0);
