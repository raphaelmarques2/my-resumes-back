-- CreateTable
CREATE TABLE "education_to_resume" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "education_id" TEXT NOT NULL,
    "resume_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_to_resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "education_to_resume" ADD CONSTRAINT "education_to_resume_education_id_fkey" FOREIGN KEY ("education_id") REFERENCES "education"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_to_resume" ADD CONSTRAINT "education_to_resume_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
