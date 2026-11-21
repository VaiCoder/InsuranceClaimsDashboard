
import type { ClaimDocument } from "../../../types/document.types";
import { mockDocuments } from "../data/documents.mock";
import { PDFDocument } from "pdf-lib";

let documents = [...mockDocuments];
const uploadedDocumentUrls = new Map<string, string>();

export async function getDocumentsByClaim(
  claimId: string
): Promise<ClaimDocument[]> {
  return documents.filter((document) => document.claimId === claimId);
}

export async function deleteDocument(
  documentId: string
): Promise<void> {
  const uploadedUrl = uploadedDocumentUrls.get(documentId);

  if (uploadedUrl) {
    URL.revokeObjectURL(uploadedUrl);
    uploadedDocumentUrls.delete(documentId);
  }

  documents = documents.filter(
    (document) => document.id !== documentId
  );
}


export async function uploadDocument(
  file: File,
  claimId: string
): Promise<ClaimDocument> {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported.");
  }

  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  const documentId = crypto.randomUUID();

  const newDocument: ClaimDocument = {
    id: documentId,
    claimId,
    name: file.name,
    type: "PDF",
    sizeBytes: file.size,
    pageCount: pdf.getPageCount(),
    uploadedAt: new Date().toISOString(),
    status: "AVAILABLE",
  };

  documents = [...documents, newDocument];

  uploadedDocumentUrls.set(
    documentId,
    URL.createObjectURL(file)
  );

  return newDocument;
}

export function getDocumentFileUrl(
  documentId: string
): string | undefined {
  return uploadedDocumentUrls.get(documentId);
}

