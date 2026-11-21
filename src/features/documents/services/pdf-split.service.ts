
import { PDFDocument } from "pdf-lib";

/**
 * Splits a PDF into a new PDF containing the requested page range.
 * Page numbers are 1-based and inclusive.
 */
export async function splitPdf(
  file: File,
  startPage: number,
  endPage: number
): Promise<Uint8Array> {
  if (startPage < 1 || endPage < startPage) {
    throw new Error("Invalid page range.");
  }

  const sourceBytes = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(sourceBytes);

  const totalPages = sourcePdf.getPageCount();

  if (endPage > totalPages) {
    throw new Error(`The PDF contains only ${totalPages} pages.`);
  }

  const newPdf = await PDFDocument.create();

  const pageIndices = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage - 1 + index
  );

  const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);

  copiedPages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}
