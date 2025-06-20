-- AlterTable
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
