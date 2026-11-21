
import { PDFDocument } from "pdf-lib";

/**
 * Merges multiple PDF files into a single PDF.
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Select at least two PDF files to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    if (file.type !== "application/pdf") {
      throw new Error(`${file.name} is not a PDF file.`);
    }

    const sourceBytes = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(sourceBytes);

    const pageIndices = sourcePdf.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(
      sourcePdf,
      pageIndices,
    );

    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}
