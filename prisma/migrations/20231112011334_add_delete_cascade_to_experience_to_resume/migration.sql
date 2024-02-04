-- DropForeignKey
ALTER TABLE "experience_to_resume" DROP CONSTRAINT "experience_to_resume_experience_id_fkey";

-- DropForeignKey
ALTER TABLE "experience_to_resume" DROP CONSTRAINT "experience_to_resume_resume_id_fkey";

-- AddForeignKey
ALTER TABLE "experience_to_resume" ADD CONSTRAINT "experience_to_resume_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_to_resume" ADD CONSTRAINT "experience_to_resume_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
